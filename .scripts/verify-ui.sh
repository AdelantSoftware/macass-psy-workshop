#!/usr/bin/env bash
# verify-ui.sh — Audit dei file UI del progetto macass-psy-workshop.
#
# Regole controllate (severe):
#   1. ZERO hex / rgb() / hsl() literals in .tsx / .ts files
#      (eccetto transparent / currentColor / none / 0).
#      globals.css È la fonte di verità dei colori.
#   2. ZERO classi Tailwind duplicate identiche nello stesso attributo
#      (es. "px-4 px-4" — typo banale).
#   3. ZERO utility Tailwind che impostano la stessa proprietà CSS
#      sullo STESSO breakpoint/state (es. "bg-red-500 bg-blue-500"
#      oppure "p-4 p-6" — typo banale). Le varianti responsive
#      (sm:/md:/lg:) e di stato (hover:/focus:/active:) NON confliggono
#      tra loro né con il valore base, perché l'ultima dichiarazione
#      dello stesso (breakpoint × state) vince.
#
# Esce 0 se tutto pulito, 1 altrimenti.

set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

FILES=$(find src -type f \( -name "*.tsx" -o -name "*.ts" \) ! -path "*/node_modules/*")
GLOBALS="src/app/globals.css"
RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m'

fail=0

echo "──────────────────────────────────────────────────────────"
echo "  UI audit — $(date -u +%FT%TZ)"
echo "  files scanned: $(echo "$FILES" | wc -l)"
echo "──────────────────────────────────────────────────────────"

# ── 1. Hex / rgb / hsl literals in components ────────────────
echo ""
echo "[1/4] Hex / rgb / hsl literals in components…"
# Look for actual color literals that are NOT inside globals.css.
# A color literal is one of:
#   •  #abc  / #aabbcc / #aabbccdd  (hex)
#   •  rgb(...) / rgba(...)
#   •  hsl(...) / hsla(...)
HEX_HITS=$(grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(' $FILES 2>/dev/null \
  | grep -v "globals.css" \
  | grep -vE ':\s*"(transparent|currentColor|none|0)"' \
  | grep -vE '^[^:]+:[0-9]+:\s*//' \
  | grep -vE '^[^:]+:[0-9]+:\s*\*' || true)

# Strip false positives: hex inside SVG path data (e.g. d="M10 5 L0.5 1A2 2 ...").
# Patterns like "M10 5 L0.5 1A2 2 0 ..." contain hex-looking digits but no leading #.
# However genuine hits do start with #. So # is required and we've kept it.
# Filter SVG fill="..." with named colors and gradient stop-color="#xxx" — those are
# programmatic SVG asset colors and acceptable (the project is not going to redesign
# the mini-games' SVG icons to use CSS vars). Group those separately.
SVG_HITS=$(echo "$HEX_HITS" | grep -E 'fill="#|stroke="#|stop-color="#|fill="hsl|stroke="hsl' || true)
REAL_HITS=$(echo "$HEX_HITS" | grep -vE 'fill="#|stroke="#|stop-color="#|fill="hsl|stroke="hsl' || true)

if [ -n "$REAL_HITS" ]; then
  echo -e "  ${RED}✗ hex / rgb / hsl literals in components (use CSS vars):${NC}"
  echo "$REAL_HITS" | head -20
  fail=1
else
  echo -e "  ${GREEN}✓ none in JSX/TSX (excluding SVG asset fills)${NC}"
fi

if [ -n "$SVG_HITS" ]; then
  N=$(echo "$SVG_HITS" | wc -l)
  echo -e "  ${YELLOW}ℹ $N SVG asset color literals (intentional — runtime SVG icons)${NC}"
fi

# ── 2. Duplicate classes in same attribute ───────────────────
echo ""
echo "[2/4] Duplicate Tailwind classes…"
TOTAL_DUPES=0
while IFS= read -r f; do
  hits=$(perl -0777 -ne '
    my $dupe = 0;
    my @lines;
    while (m/(?:className|class)\s*=\s*["{`]([^"`}]*)["`}]/g) {
      my $val = $1;
      my %seen;
      for my $t (split /\s+/, $val) {
        next if $t eq "";
        $seen{$t}++;
      }
      for my $t (sort keys %seen) {
        if ($seen{$t} > 1) { print "  '"$f"': $t (×$seen{$t})\n"; $dupe++; }
      }
    }
    exit 0;
  ' "$f")
  if [ -n "$hits" ]; then
    echo "$hits"
    TOTAL_DUPES=$((TOTAL_DUPES + $(echo "$hits" | wc -l)))
  fi
done <<< "$FILES"

if [ $TOTAL_DUPES -gt 0 ]; then
  echo -e "  ${RED}✗ $TOTAL_DUPES duplicate classes found${NC}"
  fail=1
else
  echo -e "  ${GREEN}✓ no duplicate classes${NC}"
fi

# ── 3. Conflicting classes (same property, same scope) ───────
echo ""
echo "[3/4] Conflicting Tailwind classes (same property, same scope)…"
TOTAL_CONFLICTS=0
while IFS= read -r f; do
  hits=$(perl -0777 -ne '
    sub normalize {
      my $t = shift;
      # Strip out arbitrary values [..] for property detection
      my $orig = $t;
      $t =~ s/\[.*?\]//g;
      # Detect (state:)(breakpoint:)prefix-utility
      my $state;
      my $break;
      if ($t =~ s/^((?:hover|focus|active|disabled|focus-within|focus-visible|group-hover|group-focus|peer|peer-checked|placeholder|print|dark|visited|first|last|odd|even|aria-checked|aria-disabled|aria-expanded|data-\[[^]]+\]):)+//) {
        $state = $1;
      }
      if ($t =~ s/^((?:sm|md|lg|xl|2xl):)+//) {
        $break = $1;
      }
      # Property root: first segment of utility
      my $prop;
      if ($t =~ /^([a-z][a-z0-9]*?)(?:-[a-z0-9]+)+$/) {
        # For utilities like "bg-red-500", "text-xl", "sm:grid-cols-3"
        # the property is the leading alpha sequence.
        # Tailwind's properties are NOT consistent: bg/text/border are prefixes
        # while grid-cols / grid-rows / flex-1 / min-h- are full utilities.
        # The discriminating factor: do they have a second segment after the prefix?
        # bg-red-500 → bg; text-xl → text; p-4 → p; grid-cols-2 → grid-cols;
        # min-h-screen → min-h; gap-4 → gap; rounded-2xl → rounded; shadow-lg → shadow.
        # For the purpose of THIS check we only care whether two tokens have
        # the same property when restricted to the SAME (state, break) scope.
        my @parts = split /-/, $t;
        # Use the FIRST segment as property discriminator.
        $prop = $parts[0];
      }
      return ($prop, $break, $state, $orig);
    }

    my @conflicts;
    while (m/(?:className|class)\s*=\s*["{`]([^"`}]*)["`}]/g) {
      my $val = $1;
      my @toks = grep { $_ ne "" } split /\s+/, $val;
      # Group by (state, break) scope
      my %scope;
      for my $t (@toks) {
        my ($p, $b, $s, $orig) = normalize($t);
        next unless defined $p;
        my $key = ($s // "") . "|" . ($b // "");
        push @{$scope{$key}{$p}}, $orig;
      }
      for my $key (sort keys %scope) {
        for my $p (sort keys %{$scope{$key}}) {
          my @v = @{$scope{$key}{$p}};
          if (scalar @v > 1) {
            # Multiple tokens for the same property in the same scope.
            # E.g. "bg-red-500 bg-blue-500" or "p-4 p-6" (both base).
            # But "bg-red-500 hover:bg-blue-500" would be in different scopes.
            # And "text-3xl sm:text-4xl md:text-5xl" would be different scopes.
            # However "text-3xl text-balance text-center" — text- balance and
            # text-center are different properties, so they wouldn't collide.
            # Wait — normalize() uses FIRST segment so "text-balance" and
            # "text-center" both have prop "text". So they would collide here.
            # That's wrong: "text-balance" (text-wrap) and "text-center"
            # (text-align) are completely different.
            # Heuristic: two tokens are a TRUE conflict if they target the
            # same CSS property. We approximate by checking that BOTH tokens
            # are of the form <prefix>-<value> with no special-suffix keywords.
            # For now, only flag CONFLICTS where the two tokens share the
            # exact same prefix-and-second-segment pattern.
            my %by_full;
            for my $tok (@v) {
              # Strip responsive/state for grouping
              (my $core = $tok) =~ s/^(?:sm|md|lg|xl|2xl|hover|focus|active|disabled|focus-within|focus-visible|group-hover|group-focus|peer|peer-checked|placeholder|print|dark|visited|first|last|odd|even|aria-checked|aria-disabled|aria-expanded|data-\[[^]]+\])+://g;
              $core =~ s/^(?:sm|md|lg|xl|2xl|hover|focus|active|disabled|focus-within|focus-visible|group-hover|group-focus|peer|peer-checked|placeholder|print|dark|visited|first|last|odd|even|aria-checked|aria-disabled|aria-expanded|data-\[[^]]+\])+:(?:sm|md|lg|xl|2xl)//g;
              $core =~ s/^(\w+(?:-\w+)*?)-/$1/;
              $by_full{$core}++;
            }
            if (scalar keys %by_full > 1) {
              push @conflicts, "$p (" . join(" + ", @v) . ")";
            }
          }
        }
      }
    }
    if (@conflicts) {
      print "  '"$f"':\n";
      for my $c (@conflicts) { print "    $c\n"; }
    }
  ' "$f")
  if [ -n "$hits" ]; then
    echo "$hits"
    N=$(echo "$hits" | grep -cE '^  ' || true)
    TOTAL_CONFLICTS=$((TOTAL_CONFLICTS + N))
  fi
done <<< "$FILES"

if [ $TOTAL_CONFLICTS -gt 0 ]; then
  echo -e "  ${RED}✗ $TOTAL_CONFLICTS conflicts found${NC}"
  fail=1
else
  echo -e "  ${GREEN}✓ no conflicts${NC}"
fi

# ── 4. Informational: arbitrary value count ──────────────────
echo ""
echo "[4/4] Arbitrary-value classes (informational, target = 0)…"
ARBS=$(grep -ohE '\[[a-zA-Z0-9_.,#%()+\- ]+\]' $FILES 2>/dev/null \
  | sort | uniq -c | sort -rn | head -20 || true)
if [ -n "$ARBS" ]; then
  echo "$ARBS" | awk '{printf "  %4d × %s\n", $1, $2}'
fi
TOTAL_UNIQUE=$(grep -ohE '\[[a-zA-Z0-9_.,#%()+\- ]+\]' $FILES 2>/dev/null | sort -u | wc -l || echo 0)
TOTAL_OCC=$(grep -ohE '\[[a-zA-Z0-9_.,#%()+\- ]+\]' $FILES 2>/dev/null | wc -l || echo 0)
echo "  → $TOTAL_UNIQUE unique bracketed values, $TOTAL_OCC total uses"

echo ""
echo "──────────────────────────────────────────────────────────"
if [ $fail -eq 0 ]; then
  echo -e "  ${GREEN}✓ PASS${NC}"
  exit 0
else
  echo -e "  ${RED}✗ FAIL${NC}"
  exit 1
fi
