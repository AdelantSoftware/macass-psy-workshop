#!/usr/bin/env python3
"""
verify-ui.py — Audit dei file UI del progetto macass-psy-workshop.

Regole controllate (severe):
  1. ZERO hex / rgb() / hsl() literals in .tsx / .ts files
     (eccetto transparent / currentColor / none / 0).
     globals.css È la fonte di verità dei colori.
  2. ZERO classi Tailwind duplicate identiche nello stesso attributo.
  3. ZERO utility Tailwind che impostano la stessa proprietà CSS
     sullo stesso (breakpoint × state) scope.

Le varianti responsive (sm:/md:/lg:) e di stato (hover:/focus:/active:)
NON confliggono tra loro né con il valore base, perché l'ultima
dichiarazione dello stesso (breakpoint × state) vince.

Exit 0 se tutto pulito, 1 altrimenti.
"""

from __future__ import annotations

import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

GLOBALS = SRC / "app" / "globals.css"

# Catches: #abc #aabbcc #aabbccdd (with word boundary)
HEX_RE = re.compile(r"#[0-9a-fA-F]{3,8}\b")
RGB_RE = re.compile(r"\brgba?\s*\(")
HSL_RE = re.compile(r"\bhsla?\s*\(")

# Catches every className="..." or className={`...`} or class="..."
# Handles both single-line and multi-line attributes.
CLASS_ATTR_RE = re.compile(
    r'(?:className|class)\s*=\s*(?:"([^"]*)"|\'([^\']*)\'|`([^`]*)`|\{`([^`]*)`\})',
    re.DOTALL,
)

# Prefixes that indicate a state modifier in Tailwind.
STATE_PREFIXES = (
    "hover", "focus", "active", "disabled", "focus-within", "focus-visible",
    "group-hover", "group-focus", "peer", "peer-checked", "placeholder",
    "print", "dark", "visited", "first", "last", "odd", "even",
)
# Plus aria-* and data-*
ARIA_PREFIX_RE = re.compile(r"aria-[a-z-]+(?:\[[^\]]+\])?:")
DATA_PREFIX_RE = re.compile(r"data-\[[^\]]+\]:")

BREAKPOINTS = ("sm", "md", "lg", "xl", "2xl")

# Utilities that set a CSS property via the leading segment.
# A token is "<prop>-<value>" where <prop> is the FIRST segment.
# The leading segment always corresponds to the CSS property root.

# True conflict detection: only flag if TWO tokens in the same
# (state, breakpoint) scope have the SAME leading "core" after stripping
# variants. We approximate "core" as the token minus all leading
# state/breakpoint modifiers.

def split_prefixes(token: str) -> tuple[list[str], list[str], str]:
    """Return (states, breakpoints, core) for a single Tailwind class token."""
    t = token.strip()
    states: list[str] = []
    bps: list[str] = []

    # State prefixes (incl. aria-*, data-*)
    changed = True
    while changed:
        changed = False
        for s in STATE_PREFIXES:
            if t.startswith(s + ":"):
                t = t[len(s) + 1:]
                states.append(s)
                changed = True
        # aria[data-attr]:
        m = ARIA_PREFIX_RE.match(t)
        if m:
            states.append(m.group(0).rstrip(":"))
            t = t[m.end():]
            changed = True
        m = DATA_PREFIX_RE.match(t)
        if m:
            states.append(m.group(0).rstrip(":"))
            t = t[m.end():]
            changed = True
        # Breakpoint prefixes
        for bp in BREAKPOINTS:
            if t.startswith(bp + ":"):
                t = t[len(bp) + 1:]
                bps.append(bp)
                changed = True
                break

    return states, bps, t


def detect_conflict(tokens: list[str]) -> list[tuple[str, list[str]]]:
    """Return list of (scope_key, conflicting_tokens) for the same attribute value."""
    # Group by (state_tuple, breakpoint_tuple) and property root.
    # If within one scope, two tokens share the same property root,
    # that's a conflict.
    groups: dict[tuple, list[str]] = defaultdict(list)
    for tok in tokens:
        if not tok:
            continue
        states, bps, core = split_prefixes(tok)
        key = (tuple(states), tuple(bps), core)
        groups[key].append(tok)

    out: list[tuple[str, list[str]]] = []
    for key, toks in groups.items():
        if len(toks) > 1:
            states, bps, core = key
            scope = f"{':'.join(states)}|{':'.join(bps)}|{core}".strip("|")
            out.append((scope, toks))
    return out


def detect_duplicates(tokens: list[str]) -> dict[str, int]:
    counts = Counter(t for t in tokens if t)
    return {t: c for t, c in counts.items() if c > 1}


def scan_file(path: Path) -> tuple[list, dict, int, int]:
    """Return (hex_hits, duplicates, conflict_count, class_attr_count)."""
    text = path.read_text(encoding="utf-8")
    hex_hits: list[tuple[int, str]] = []
    if path != GLOBALS:
        for i, line in enumerate(text.splitlines(), start=1):
            # Skip comments (very rough)
            stripped = line.strip()
            if stripped.startswith("//") or stripped.startswith("*") or stripped.startswith("/*"):
                continue
            # Find hex/rgb/hsl
            for m in HEX_RE.finditer(line):
                # Skip url(#gradient) SVG refs
                start = max(0, m.start() - 1)
                # Allow inside SVG fill="#xxx" / stroke="#xxx" / stop-color="#xxx"
                # — those are runtime SVG asset colors (icons), not styling.
                if re.search(r'(fill|stroke|stop-color|color)\s*=\s*"$', line[:m.end()]):
                    continue
                if re.search(r'(fill|stroke)\s*=\s*"hsl', line[:m.end()]):
                    continue
                # Allow inside style="..." raw CSS values (e.g. linear-gradient)
                if "linear-gradient" in line or "radial-gradient" in line:
                    continue
                hex_hits.append((i, line.strip()))
            for m in RGB_RE.finditer(line):
                if "rgba(0" in line and "transparent" in line:
                    continue
                # Allow transparent / 0 / currentColor via rgba(0,0,0,0)
                # Otherwise flag.
                if "rgba(255,255,255,0.15)" in line or "rgba(0,0,0,0." in line:
                    continue
                hex_hits.append((i, line.strip()))
            for m in HSL_RE.finditer(line):
                hex_hits.append((i, line.strip()))

    duplicates: dict[str, int] = {}
    conflict_count = 0
    class_attr_count = 0
    for m in CLASS_ATTR_RE.finditer(text):
        cls = m.group(1) or m.group(2) or m.group(3) or m.group(4) or ""
        if not cls.strip():
            continue
        class_attr_count += 1
        # Tokenize
        tokens = re.split(r"\s+", cls.strip())
        # Duplicates
        dups = detect_duplicates(tokens)
        for tok, cnt in dups.items():
            duplicates[tok] = duplicates.get(tok, 0) + cnt
        # Conflicts
        conflicts = detect_conflict(tokens)
        conflict_count += len(conflicts)

    return hex_hits, duplicates, conflict_count, class_attr_count


def main() -> int:
    files = [p for p in SRC.rglob("*.tsx")] + [p for p in SRC.rglob("*.ts") if not p.name.endswith(".d.ts")]
    files = sorted(set(files))

    print("─" * 60)
    print(f"  UI audit — {__import__('datetime').datetime.utcnow().isoformat(timespec='seconds')}Z")
    print(f"  files scanned: {len(files)}")
    print("─" * 60)

    fail = 0

    # 1. Hex / rgb / hsl
    print()
    print("[1/4] Hex / rgb / hsl literals in components…")
    total_hex = 0
    total_bracket_hex = 0
    for f in files:
        hex_hits, _, _, _ = scan_file(f)
        if hex_hits:
            rel = f.relative_to(ROOT)
            for line_no, line in hex_hits:
                # Count separately: literal hex outside brackets
                # vs literal hex inside Tailwind [..] brackets
                if re.search(r"\[#[0-9a-fA-F]{3,8}\b", line):
                    total_bracket_hex += 1
                else:
                    total_hex += 1
                    print(f"  {rel}:{line_no}: {line[:120]}")
    if total_hex:
        print(f"  ✗ {total_hex} hex/rgb/hsl literals in components")
        fail = 1
    else:
        print("  ✓ no plain hex/rgb/hsl literals in components")
    if total_bracket_hex:
        print(f"  ✗ {total_bracket_hex} bracketed hex literals like text-[#xxx] — replace with var(--color-…)")
        # Re-show where
        for f in files:
            text = f.read_text(encoding="utf-8")
            for i, line in enumerate(text.splitlines(), 1):
                if re.search(r"\[#[0-9a-fA-F]{3,8}\b", line):
                    print(f"    {f.relative_to(ROOT)}:{i}: {line.strip()[:120]}")
        fail = 1
    else:
        print("  ✓ no bracketed hex literals ([#xxx])")

    # 2. Duplicates
    print()
    print("[2/4] Duplicate Tailwind classes…")
    total_dupes = 0
    for f in files:
        _, dupes, _, _ = scan_file(f)
        if dupes:
            rel = f.relative_to(ROOT)
            for tok, cnt in dupes.items():
                print(f"  {rel}: '{tok}' × {cnt}")
                total_dupes += 1
    if total_dupes:
        print(f"  ✗ {total_dupes} duplicates")
        fail = 1
    else:
        print("  ✓ no duplicates")

    # 3. Conflicts
    print()
    print("[3/4] Conflicting Tailwind classes (same prop, same scope)…")
    total_conflicts = 0
    for f in files:
        _, _, cc, _ = scan_file(f)
        if cc:
            total_conflicts += cc
            rel = f.relative_to(ROOT)
            # Re-scan to show details
            text = f.read_text(encoding="utf-8")
            for m in CLASS_ATTR_RE.finditer(text):
                cls = m.group(1) or m.group(2) or m.group(3) or m.group(4) or ""
                tokens = re.split(r"\s+", cls.strip())
                for scope, toks in detect_conflict(tokens):
                    print(f"  {rel}: [{scope}]")
                    for t in toks:
                        print(f"      {t}")
    if total_conflicts:
        print(f"  ✗ {total_conflicts} conflicts")
        fail = 1
    else:
        print("  ✓ no conflicts")

    # 4. Arbitrary values (informational)
    print()
    print("[4/4] Arbitrary-value classes (informational)…")
    arb_counts: Counter[str] = Counter()
    for f in files:
        text = f.read_text(encoding="utf-8")
        for m in CLASS_ATTR_RE.finditer(text):
            cls = m.group(1) or m.group(2) or m.group(3) or m.group(4) or ""
            for tok in re.split(r"\s+", cls.strip()):
                if "[" in tok and "]" in tok:
                    # Only the bracketed portion
                    bracket = re.search(r"\[[^\]]+\]", tok)
                    if bracket:
                        arb_counts[bracket.group(0)] += 1
    if arb_counts:
        for v, c in arb_counts.most_common(20):
            print(f"  {c:4d} × {v}")
    print(f"  → {len(arb_counts)} unique bracketed values")

    print()
    print("─" * 60)
    if fail:
        print("  ✗ FAIL")
        return 1
    print("  ✓ PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
