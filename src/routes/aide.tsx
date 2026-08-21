import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/aide")({
  head: () => ({
    meta: [
      { title: "Aide — Recueil des Chants TESP" },
      {
        name: "description",
        content:
          "Comment utiliser le Recueil des Chants TESP : rechercher un cantique, afficher son texte et régler la police.",
      },
      { property: "og:title", content: "Aide — Recueil des Chants TESP" },
      {
        property: "og:description",
        content: "Guide d'utilisation du Recueil des Chants TESP.",
      },
    ],
  }),
  component: Aide,
});

const etapes = [
  {
    titre: "1. Ouvrir la liste des cantiques",
    texte:
      "Depuis le menu (icône ☰ en haut à gauche), touchez « Accueil ». La liste de tous les cantiques s'affiche avec leur numéro et leur nom.",
  },
  {
    titre: "2. Rechercher un cantique",
    texte:
      "Dans la barre de recherche en haut de l'accueil, tapez le numéro du cantique ou une partie de son nom. La liste se filtre automatiquement.",
  },
  {
    titre: "3. Afficher le texte du cantique",
    texte:
      "Touchez le nom du cantique : son texte complet s'ouvre dans une nouvelle page. Utilisez la flèche ← en haut à gauche pour revenir à la liste.",
  },
  {
    titre: "4. Passer d'un cantique à l'autre",
    texte:
      "En bas de la page d'un cantique, les boutons ‹ et › permettent d'aller au cantique précédent ou suivant.",
  },
  {
    titre: "5. Adapter la lecture",
    texte:
      "Dans « Paramètres », choisissez le style de police et agrandissez la taille du texte pour une lecture confortable.",
  },
];

function Aide() {
  return (
    <AppShell title="Aide" backTo="/">
      <p className="text-muted-foreground mb-5 text-sm">
        Voici comment utiliser l'application pour lire les cantiques.
      </p>
      <ol className="space-y-4">
        {etapes.map((e) => (
          <li key={e.titre} className="bg-card shadow-soft rounded-lg border p-4">
            <h2 className="font-display text-lg font-semibold">{e.titre}</h2>
            <p className="mt-1 text-sm leading-relaxed">{e.texte}</p>
          </li>
        ))}
      </ol>
    </AppShell>
  );
}
