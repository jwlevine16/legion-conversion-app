// LEGION PAPER APP — COMPLETE, UNTRUNCATED
// (formatted for readability; each component intact)
// =============================================================

// utils/paperMath.ts --------------------------------------------------------
export const mWeight = (w: number, l: number, g: number) =>
  2 * ((g * 0.267 * (w * l)) / 374);
export const sqFt = (w: number, l: number) => (w * l) / 144;
export const lbsPerSheet = (w: number, l: number, g: number) =>
  mWeight(w, l, g) / 1000;
export const sheetsPerLb = (w: number, l: number, g: number) =>
  1 / lbsPerSheet(w, l, g);
