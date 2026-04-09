export const PROTEINS = [
  "chicken",
  "steak",
  "barbacoa",
  "carnitas",
  "sofritas",
  "veggie",
] as const;

export type Protein = typeof PROTEINS[number];

export const PROTEIN_LABELS: Record<Protein, string> = {
  chicken:  "Chicken",
  steak:    "Steak",
  barbacoa: "Barbacoa",
  carnitas: "Carnitas",
  sofritas: "Sofritas",
  veggie:   "Veggie",
};

const CDN = "https://www.chipotle.com/content/dam/chipotle/menu/menu-items";

export const PROTEIN_IMAGES: Record<Protein, string> = {
  chicken:  `${CDN}/cmg-6601-chicken/web-desktop/order.png`,
  steak:    `${CDN}/cmg-6602-steak/web-desktop/order.png`,
  barbacoa: `${CDN}/cmg-6604-barbacoa/web-desktop/order.png`,
  carnitas: `${CDN}/cmg-6603-carnitas/web-desktop/order.png`,
  sofritas: `${CDN}/cmg-6605-sofritas/web-desktop/order.png`,
  veggie:   `${CDN}/cmg-1025-large-side-of-guac/web-desktop/order.png`,
};
