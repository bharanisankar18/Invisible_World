const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";

/** 2e-6 → "2 × 10⁻⁶ m"; 1 → "1 m". `digits` controls the mantissa precision. */
export function sci(m, digits = 0, unit = "m") {
  const [mant, exp] = m.toExponential(digits).split("e");
  const e = Number(exp);
  if (e === 0) return `${mant} ${unit}`;
  const sup = String(e).replace("-", "⁻").replace(/\d/g, (d) => SUP[d]);
  return `${mant} × 10${sup} ${unit}`;
}
