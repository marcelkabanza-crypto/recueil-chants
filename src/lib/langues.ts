import type { Cantique } from "@/data/cantiques";

export type Langue = "fr" | "ln" | "sw" | "lu";

export const LANGUES: { code: Langue; label: string; menu: string }[] = [
  { code: "ln", label: "Recueil Lingala", menu: "Recueil Lingala" },
  { code: "sw", label: "Recueil Swahili", menu: "Recueil Swahili" },
  { code: "lu", label: "Recueil Tshiluba", menu: "Recueil Tshiluba" },
  { code: "fr", label: "Crois seulement (français)", menu: "Recueil Crois seulement" },
];

export const isLangue = (value: string): value is Langue =>
  LANGUES.some((l) => l.code === value);

/** Les cantiques sans langue explicite sont considérés comme français. */
export const langueDe = (c: Cantique): Langue => {
  const l = (c.langue ?? "fr").toLowerCase();
  return isLangue(l) ? l : "fr";
};

export const labelLangue = (code: Langue): string =>
  LANGUES.find((l) => l.code === code)?.label ?? "Recueil";
