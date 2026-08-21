import recueil from "./cantiques.json";

export type Cantique = {
  numero: number;
  nom: string;
  texte: string;
};

export type Recueil = {
  version: number;
  updatedAt: string;
  cantiques: Cantique[];
};

/**
 * Recueil livré avec l'application (100 % hors ligne).
 * Les mises à jour téléchargées sont stockées dans localStorage.
 */
export const recueilLocal = recueil as Recueil;

export const cantiques: Cantique[] = recueilLocal.cantiques;

export const versionLocale = recueilLocal.version;

export const getCantique = (numero: number) =>
  cantiques.find((c) => c.numero === numero);
