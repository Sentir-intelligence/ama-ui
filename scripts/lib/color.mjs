// WCAG 2.x contrast, OKLab conversion and Machado (2009) colour-vision simulation.
const toLin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const fromLin = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const hex = (lin) => "#" + lin.map((c) => Math.round(Math.min(1, Math.max(0, fromLin(Math.min(1, Math.max(0, c))))) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();

export function luminance(h) { const [r, g, b] = rgb(h).map(toLin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
export function contrast(a, b) {
  const [x, y] = [luminance(a.slice(0, 7)), luminance(b.slice(0, 7))].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
export function oklab(h) {
  const [r, g, b] = rgb(h.slice(0, 7)).map(toLin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
export const deltaE = (a, b) => 100 * Math.hypot(...oklab(a).map((v, i) => v - oklab(b)[i]));
const M = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
  tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]],
};
export const CVD = Object.keys(M);
export function simulate(h, type) {
  const c = rgb(h.slice(0, 7)).map(toLin);
  return hex(M[type].map((row) => row.reduce((sum, v, i) => sum + v * c[i], 0)));
}
