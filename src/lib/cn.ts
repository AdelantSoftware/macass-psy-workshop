/**
 * Tiny class-name combiner. Accepts strings, falsy values, or arrays.
 * Keeps Tailwind usage readable inside `className={...}` without pulling
 * in a runtime dependency.
 */
export function cn(
  ...values: Array<string | number | false | null | undefined | (string | false | null | undefined)[]>
): string {
  const out: string[] = [];
  for (const value of values) {
    if (!value) continue;
    if (Array.isArray(value)) {
      const inner = cn(...value);
      if (inner) out.push(inner);
    } else if (typeof value === "string" || typeof value === "number") {
      const s = String(value).trim();
      if (s) out.push(s);
    }
  }
  return out.join(" ");
}
