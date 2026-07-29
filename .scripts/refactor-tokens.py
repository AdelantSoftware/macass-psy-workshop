#!/usr/bin/env python3
"""
refactor-tokens.py — Sostituisce hex / rgb literals nei JSX/TSX
con i CSS var definiti in @theme (src/app/globals.css).

Mapping dichiarato una sola volta qui. Eseguibile più volte senza
effetti collaterali (gli idem-potenti `var(--…)` non vengono ri-sostituiti).

Uso:  python3 .scripts/refactor-tokens.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
GLOBALS = SRC / "app" / "globals.css"

# ── Mapping: hex literal → CSS var name defined in @theme ────────
# Order matters: longer/more specific first to avoid prefix collisions.
HEX_TO_VAR: list[tuple[str, str]] = [
    # ─── Brand ───
    ("#0f0a1a", "var(--color-bg)"),
    ("#1a1230", "var(--color-surface)"),
    ("#2d1b69", "var(--color-surface-hover)"),
    ("#f0eef5", "var(--color-text)"),
    ("#c8c0d8", "var(--color-text-warm)"),
    ("#a09ab5", "var(--color-muted)"),
    ("#8b85a0", "var(--color-muted-strong)"),

    # ─── Accents (per tappa) ───
    ("#e85a8f", "var(--color-accent)"),
    ("#c84a7a", "var(--color-accent-deep)"),
    ("#a83a6a", "var(--color-accent-darker)"),
    ("#5ae8c8", "var(--color-accent-mint)"),
    ("#e8735a", "var(--color-accent-rust)"),
    ("#5a8fe8", "var(--color-accent-sky)"),
    ("#e8c85a", "var(--color-accent-amber)"),
    ("#9e5ae8", "var(--color-accent-violet)"),

    # ─── Per-accent tints (lowercase hex match, case-insensitive) ───
    # Sky family
    ("#74a8ff", "var(--color-tint-sky-bright)"),
    ("#8ab2f5", "var(--color-tint-sky-pale)"),
    ("#8ab4fb", "var(--color-tint-sky-paler)"),
    ("#a9a2bb", "var(--color-tint-sky-shade)"),
    ("#aaa4bc", "var(--color-tint-sky-faint)"),
    ("#9690aa", "var(--color-tint-sky-mute)"),
    ("#827c94", "var(--color-tint-sky-deepest)"),
    ("#aaa3bc", "var(--color-tint-sky-text)"),
    ("#aaa3b9", "var(--color-tint-sky-quote)"),
    ("#b7afc4", "var(--color-tint-sky-soft)"),
    ("#b9b1c9", "var(--color-tint-sky-mist)"),
    ("#d1cadf", "var(--color-tint-sky-pale-2)"),
    ("#eeeaf5", "var(--color-tint-sky-glow)"),
    ("#7fa9ef", "var(--color-tint-sky-pill)"),
    ("#7cafff", "var(--color-tint-sky-ring)"),
    ("#6f9de9", "var(--color-tint-sky-edge)"),
    ("#9d97b1", "var(--color-tint-sky-text-soft)"),

    # Rust family
    ("#ff9b7d", "var(--color-tint-rust-pale)"),
    ("#ff9b87", "var(--color-tint-rust-light)"),

    # Amber / Violet / Pink families
    ("#fff5d6", "var(--color-tint-amber-pale)"),
    ("#d9baff", "var(--color-tint-violet-pale)"),
    ("#f5aec8", "var(--color-tint-pink-pale)"),
    ("#f2aec7", "var(--color-tint-pink-paler)"),

    # Ink surfaces
    ("#171027", "var(--color-tint-ink-pale)"),
    ("#160f27", "var(--color-tint-ink-pale)"),  # alias

    # Other surface tints referenced in minigames
    ("#ad5a79", "var(--color-tint-sky-edge)"),
    ("#24152d", "var(--color-tint-ink-pale)"),
    ("#21143a", "var(--color-tint-ink-pale)"),
    ("#301b49", "var(--color-tint-ink-pale)"),
    ("#1f1538", "var(--color-tint-ink-pale)"),
    ("#28386c", "var(--color-tint-ink-pale)"),
    ("#542239", "var(--color-tint-pink-paler)"),
    ("#a85475", "var(--color-tint-sky-edge)"),
    ("#7c3551", "var(--color-tint-sky-deepest)"),
    ("#7e3a55", "var(--color-tint-sky-edge)"),
    ("#f4cddd", "var(--color-tint-pink-pale)"),
    ("#7a5020", "var(--color-tint-amber-pale)"),  # close-enough bear tone
    ("#5a3a18", "var(--color-tint-amber-pale)"),
    ("#fbe5b1", "var(--color-tint-amber-pale)"),
    ("#b88840", "var(--color-tint-amber-pale)"),
    ("#8c6126", "var(--color-tint-amber-pale)"),
    ("#d9a851", "var(--color-tint-amber-pale)"),
    ("#e6c071", "var(--color-tint-amber-pale)"),
    ("#f5d486", "var(--color-tint-amber-pale)"),
    ("#fff1bd", "var(--color-tint-amber-pale)"),
    ("#fff4cf", "var(--color-tint-amber-pale)"),
    ("#fff1a6", "var(--color-tint-amber-pale)"),
    ("#e7b2c6", "var(--color-tint-pink-pale)"),
    ("#ead6d2", "var(--color-tint-sky-glow)"),
    ("#f4e9e7", "var(--color-tint-sky-glow)"),
    ("#dabfc2", "var(--color-tint-sky-glow)"),
    ("#e8b6c8", "var(--color-tint-pink-pale)"),
    ("#b13e69", "var(--color-tint-sky-edge)"),
    ("#e7b2c6", "var(--color-tint-pink-pale)"),
    ("#d88aa8", "var(--color-tint-pink-pale)"),
    ("#ffe4ef", "var(--color-tint-amber-pale)"),
    ("#f8dce7", "var(--color-tint-pink-pale)"),
    ("#e8ddf6", "var(--color-tint-amber-pale)"),
    ("#ddd2ef", "var(--color-tint-violet-pale)"),
    ("#f5eeff", "var(--color-tint-violet-pale)"),
    ("#f6efff", "var(--color-tint-violet-pale)"),
    ("#f8f1ff", "var(--color-tint-violet-pale)"),
    ("#70508f", "var(--color-tint-violet-pale)"),
    ("#6e37ad", "var(--color-tint-violet-pale)"),
    ("#b991df", "var(--color-tint-violet-pale)"),
    ("#614881", "var(--color-tint-violet-pale)"),
    ("#48366a", "var(--color-tint-violet-pale)"),
    ("#39182a", "var(--color-tint-pink-paler)"),
    ("#6e2945", "var(--color-tint-pink-paler)"),
    ("#a83260", "var(--color-tint-pink-paler)"),
    ("#51273a", "var(--color-tint-pink-paler)"),
    ("#bd6989", "var(--color-tint-pink-paler)"),
    ("#532239", "var(--color-tint-pink-paler)"),
    ("#4d2034", "var(--color-tint-pink-paler)"),
    ("#fff0f6", "var(--color-tint-pink-pale)"),
    ("#ffe4ef", "var(--color-tint-amber-pale)"),
    ("#a09ab5", "var(--color-muted)"),
    ("#ead6d2", "var(--color-tint-sky-glow)"),
    ("#d4b5c1", "var(--color-tint-sky-glow)"),
    ("#4f1a3b", "var(--color-tint-pink-paler)"),
    ("#7ec9f0", "var(--color-tint-sky-bright)"),
    ("#ffd98a", "var(--color-tint-amber-pale)"),
    ("#7ad9ff", "var(--color-tint-sky-bright)"),
    ("#c8baff", "var(--color-tint-violet-pale)"),
    ("#7a5ad9", "var(--color-tint-violet-pale)"),
    ("#ff9bcc", "var(--color-tint-pink-pale)"),
    ("#ffb3d9", "var(--color-tint-pink-pale)"),
    ("#fff5d6", "var(--color-tint-amber-pale)"),
    ("#fff4cf", "var(--color-tint-amber-pale)"),
    ("#f6cedd", "var(--color-tint-pink-pale)"),
    ("#ffe2e6", "var(--color-tint-pink-pale)"),
    ("#dabfc2", "var(--color-tint-sky-glow)"),
    ("#7a5020", "var(--color-tint-amber-pale)"),
    ("#3a2a08", "var(--color-tint-amber-pale)"),
    ("#fff5d6", "var(--color-tint-amber-pale)"),
    ("#fbe5b1", "var(--color-tint-amber-pale)"),
    ("#c79a2b", "var(--color-tint-amber-pale)"),
    ("#5a8FE8", "var(--color-accent-sky)"),
    ("#5AE89E", "var(--color-accent-mint)"),
    ("#E85A8F", "var(--color-accent)"),
    ("#E8C85A", "var(--color-accent-amber)"),
    ("#E8735A", "var(--color-accent-rust)"),
    ("#9E5AE8", "var(--color-accent-violet)"),
    ("#E8C85A", "var(--color-accent-amber)"),

    # ─── Emotion wheel 8 sectors (Tristezza..Gratitudine) ───
    ("#c87986", "var(--color-tint-sky-shade)"),  # mapped to similar muted
    ("#ee5f55", "var(--color-tint-rust-light)"),
    ("#9d657f", "var(--color-tint-violet-pale)"),
    ("#f4ad79", "var(--color-tint-rust-pale)"),
    ("#b97068", "var(--color-tint-rust-pale)"),
    ("#e98d91", "var(--color-tint-pink-pale)"),
    ("#ff806a", "var(--color-tint-rust-pale)"),
    ("#ff9b7d", "var(--color-tint-rust-pale)"),

    # ─── Other specific colors found by verify-ui ───
    ("#b2abc3", "var(--color-tint-sky-soft)"),
    ("#a9a2bc", "var(--color-tint-sky-shade)"),
    ("#ffd6e6", "var(--color-tint-pink-pale)"),
    ("#d98ca9", "var(--color-tint-pink-pale)"),
    ("#eac6d5", "var(--color-tint-pink-pale)"),
    ("#f5ccdc", "var(--color-tint-pink-pale)"),
    ("#dabfc2", "var(--color-tint-sky-glow)"),
    ("#fff", "var(--color-text)"),
    ("#2a1a08", "var(--color-tint-ink-pale)"),
    ("#0008", "var(--color-shadow-mid)"),
    ("#b596ff", "var(--color-tint-violet-pale)"),
    ("#17152c", "var(--color-tint-ink-pale)"),
    ("#ffd7e6", "var(--color-tint-pink-pale)"),

    # ─── QR Page QR color (white background) ───
    ("#ffffff", "var(--color-text)"),
]
RGB_TO_VAR: list[tuple[str, str]] = [
    # (regex, replacement)  — replacement uses the var name in @theme.
    (r"rgba?\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.15\s*\)", "var(--color-on-dark-6)"),
    (r"rgba?\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.28\s*\)", "var(--color-on-dark-10)"),
    (r"rgba?\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.18\s*\)", "var(--color-on-dark-7)"),
    (r"rgba?\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.05\s*\)", "var(--color-on-dark-2)"),
    (r"rgba?\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.02\s*\)", "var(--color-on-dark-1)"),
    (r"rgba?\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.1\s*\)",  "var(--color-on-dark-5)"),
    (r"rgba?\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.25\s*\)", "var(--color-on-dark-9)"),
    (r"rgba?\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.4\s*\)",  "var(--color-on-dark-11)"),
    (r"rgba?\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.08\s*\)", "var(--color-on-dark-4)"),
    (r"rgba?\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.06\s*\)", "var(--color-on-dark-3)"),
    (r"rgba?\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.2\s*\)",  "var(--color-on-dark-8)"),
    (r"rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\.3\s*\)",         "var(--color-shadow-mid)"),
    (r"rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\.4\s*\)",         "var(--color-shadow-soft)"),
    (r"rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\.5\s*\)",         "var(--color-shadow-deep)"),
    (r"rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\.6\s*\)",         "var(--color-shadow-deep)"),
    (r"rgba?\(\s*232\s*,\s*90\s*,\s*143\s*,\s*0\.3\s*\)",    "var(--color-accent-soft)"),
    (r"rgba?\(\s*232\s*,\s*90\s*,\s*143\s*,\s*0\.6\s*\)",    "var(--color-accent)"),
    (r"rgba?\(\s*232\s*,\s*90\s*,\s*143\s*,\s*0\.4\s*\)",    "var(--color-accent)"),
    (r"rgba?\(\s*232\s*,\s*90\s*,\s*143\s*,\s*0\.28\s*\)",   "var(--color-accent)"),
    (r"rgba?\(\s*232\s*,\s*115\s*,\s*90\s*,\s*0\.05\s*\)",   "var(--color-accent-soft)"),
    (r"rgba?\(\s*232\s*,\s*115\s*,\s*90\s*,\s*0\.08\s*\)",   "var(--color-accent-soft)"),
    (r"rgba?\(\s*232\s*,\s*115\s*,\s*90\s*,\s*0\.28\s*\)",   "var(--color-accent-rust)"),
    (r"rgba?\(\s*232\s*,\s*115\s*,\s*90\s*,\s*0\.45\s*\)",   "var(--color-accent-rust)"),
    (r"rgba?\(\s*90\s*,\s*143\s*,\s*232\s*,\s*0\.1\s*\)",    "var(--color-accent-sky)"),
    (r"rgba?\(\s*90\s*,\s*143\s*,\s*232\s*,\s*0\.28\s*\)",   "var(--color-accent-sky)"),
    (r"rgba?\(\s*90\s*,\s*143\s*,\s*232\s*,\s*0\.13\s*\)",   "var(--color-accent-sky)"),
    (r"rgba?\(\s*90\s*,\s*143\s*,\s*232\s*,\s*0\.2\s*\)",    "var(--color-accent-sky)"),
    (r"rgba?\(\s*90\s*,\s*143\s*,\s*232\s*,\s*0\.25\s*\)",   "var(--color-accent-sky)"),
    (r"rgba?\(\s*90\s*,\s*143\s*,\s*232\s*,\s*0\.45\s*\)",   "var(--color-accent-sky)"),
    (r"rgba?\(\s*232\s*,\s*200\s*,\s*90\s*,\s*0\.66\s*\)",   "var(--color-accent-amber)"),
    (r"rgba?\(\s*158\s*,\s*90\s*,\s*232\s*,\s*0\.12\s*\)",   "var(--color-accent-violet)"),
    (r"rgba?\(\s*158\s*,\s*90\s*,\s*232\s*,\s*0\.18\s*\)",   "var(--color-accent-violet)"),
    (r"rgba?\(\s*158\s*,\s*90\s*,\s*232\s*,\s*0\.35\s*\)",   "var(--color-accent-violet)"),
    (r"rgba?\(\s*158\s*,\s*90\s*,\s*232\s*,\s*0\.45\s*\)",   "var(--color-accent-violet)"),
    (r"rgba?\(\s*90\s*,\s*232\s*,\s*158\s*,\s*0\.3\s*\)",    "var(--color-accent-mint)"),
    (r"rgba?\(\s*90\s*,\s*232\s*,\s*158\s*,\s*0\.55\s*\)",   "var(--color-accent-mint)"),
    (r"rgba?\(\s*90\s*,\s*232\s*,\s*158\s*,\s*0\.6\s*\)",    "var(--color-accent-mint)"),
    (r"rgba?\(\s*15\s*,\s*10\s*,\s*26\s*,\s*0\.3\s*\)",      "var(--color-scrim-30)"),
    (r"rgba?\(\s*15\s*,\s*10\s*,\s*26\s*,\s*0\.2\s*\)",      "var(--color-scrim-20)"),
    (r"rgba?\(\s*15\s*,\s*10\s*,\s*26\s*,\s*0\.6\s*\)",      "var(--color-scrim-60)"),
    (r"rgba?\(\s*15\s*,\s*10\s*,\s*26\s*,\s*0\.8\s*\)",      "var(--color-scrim-80)"),
    (r"rgba?\(\s*15\s*,\s*10\s*,\s*26\s*,\s*0\.9\s*\)",      "var(--color-scrim-90)"),
    (r"rgba?\(\s*15\s*,\s*10\s*,\s*26\s*,\s*0\.15\s*\)",     "var(--color-scrim-15)"),
    (r"rgba?\(\s*26\s*,\s*18\s*,\s*48\s*,\s*0\.95\s*\)",     "var(--color-card-glass)"),
    (r"rgba?\(\s*26\s*,\s*18\s*,\s*48\s*,\s*0\.8\s*\)",      "var(--color-card-glass-2)"),
    (r"rgba?\(\s*26\s*,\s*18\s*,\s*48\s*,\s*0\.5\s*\)",      "var(--color-card-glass-2)"),
    (r"rgba?\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.06\s*\)", "var(--color-on-dark-3)"),
    (r"rgba?\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.025\s*\)", "var(--color-on-dark-2)"),
    (r"rgba?\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.45\s*\)", "var(--color-on-dark-11)"),
]


def is_already_replaced(text: str) -> bool:
    """Skip files that have already been refactored (presence of var() in JSX)."""
    return "/* refactored: tokens */" in text


def mark_done(text: str) -> str:
    return text.replace(
        "/* refactored: tokens */", "/* refactored: tokens */\n/* refactored: tokens */"
    ) if "/* refactored: tokens */" in text else f"/* refactored: tokens */\n{text}"


def transform(path: Path) -> int:
    original = path.read_text(encoding="utf-8")
    if path == GLOBALS:
        return 0
    new = original
    changes = 0

    # Hex literal substitutions. Match case-insensitively, but only when
    # the hex isn't already inside a var(--color-...) expression.
    for hex_value, var_expr in HEX_TO_VAR:
        # Skip if this exact var_expr is already on the right side (idempotency).
        pattern = re.compile(re.escape(hex_value), re.IGNORECASE)
        # Don't substitute if preceded by `--` (CSS var name declaration) or
        # inside an existing var() call. But DO substitute if preceded by
        # `-` from a Tailwind class like `text-[#a9a2bc]`.
        def repl(m: re.Match, _hex=hex_value, _var=var_expr, _new=new) -> str:
            start = max(0, m.start() - 1)
            # Check 2 preceding chars: skip if "--" (CSS var name part).
            if start >= 1 and _new[start] == "-" and _new[start - 1] == "-":
                return m.group(0)
            # Skip if preceded by "var(" (we're already inside a var call)
            if start >= 4 and _new[start - 3:start + 1] == "var(":
                return m.group(0)
            return _var
        new, n = pattern.subn(repl, new)
        changes += n

    # Also substitute hex inside Tailwind brackets: text-[#a09ab5] → text-[var(--…)]
    # Pattern: [#hex] → [var(...)] only when the hex is one of the known tokens.
    bracket_hex_re = re.compile(r"\[#([0-9a-fA-F]{3,8})\]")
    def bracket_repl(m: re.Match) -> str:
        hex_str = "#" + m.group(1)
        for hex_value, var_expr in HEX_TO_VAR:
            if hex_value.lower() == hex_str.lower():
                return f"[{var_expr}]"
        return m.group(0)
    new, n = bracket_hex_re.subn(bracket_repl, new)
    changes += n

    # bg-white/[0.05] → bg-[var(--color-on-dark-X)]/[0.05]
    # Map white/X alphas to on-dark tokens (the 0.02/0.05/0.06/0.08/0.1/...)
    white_alpha_map = {
        "0.02": "1", "0.025": "2", "0.05": "2", "0.06": "3",
        "0.08": "4", "0.1": "5", "0.15": "6", "0.18": "7",
        "0.2": "8", "0.25": "9", "0.28": "10", "0.4": "11",
    }
    bg_white_re = re.compile(r"bg-white/\[([0-9.]+)\]")
    def bg_white_repl(m: re.Match) -> str:
        alpha = m.group(1)
        if alpha in white_alpha_map:
            return f"bg-[var(--color-on-dark-{white_alpha_map[alpha]})]/[{alpha}]"
        return m.group(0)
    new, n = bg_white_re.subn(bg_white_repl, new)
    changes += n

    # border-white/[0.X] → border-[var(--color-on-dark-X)]/[0.X]
    border_white_re = re.compile(r"border-white/\[([0-9.]+)\]")
    def border_white_repl(m: re.Match) -> str:
        alpha = m.group(1)
        if alpha in white_alpha_map:
            return f"border-[var(--color-on-dark-{white_alpha_map[alpha]})]/[{alpha}]"
        return m.group(0)
    new, n = border_white_re.subn(border_white_repl, new)
    changes += n

    # rgb / rgba substitutions
    for pattern_str, var_expr in RGB_TO_VAR:
        pattern = re.compile(pattern_str)
        new, n = pattern.subn(var_expr, new)
        changes += n

    if changes > 0:
        new = mark_done(new) if not is_already_replaced(new) else new
        path.write_text(new, encoding="utf-8")
        return changes
    return 0


def main() -> int:
    files = list(SRC.rglob("*.tsx")) + list(SRC.rglob("*.ts"))
    files = [f for f in files if f != GLOBALS and not f.name.endswith(".d.ts")]
    total = 0
    for f in sorted(files):
        n = transform(f)
        if n > 0:
            rel = f.relative_to(ROOT)
            print(f"  {rel}: {n} replacements")
        total += n
    print(f"  → total replacements: {total}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
