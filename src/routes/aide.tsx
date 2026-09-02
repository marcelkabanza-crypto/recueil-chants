import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/aide")({
  head: () => ({
    meta: [
      { title: "Aide — Recueil des Chants TESP" },
      {
        name: "description",
        content:
          "Guide détaillé du Recueil des Chants TESP : rechercher un cantique, lire le texte, changer de recueil, partager, créer des listes et régler l'affichage.",
      },
      { property: "og:title", content: "Aide — Recueil des Chants TESP" },
      {
        property: "og:description",
        content: "Guide complet d'utilisation du Recueil des Chants TESP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Aide,
});

type Etape = { symbole: string; titre: string; points: string[] };

const etapes: Etape[] = [
  {
    symbole: "☰",
    titre: "Le menu principal (en haut à gauche)",
    points: [
      "🏠 Accueil : la liste complète des cantiques du recueil français.",
      "❓ Aide : cette page.",
      "⚙️ Paramètres : police, taille du texte, mode jour/nuit, contacts.",
      "📖 Livre du conducteur : vos listes de chants pour conduire le culte.",
      "ℹ️ À propos : version de l'application et concepteur.",
      "▶️ Notre chaîne YouTube : les cultes et chants en vidéo.",
      "⏻ Quitter : fermer l'application.",
    ],
  },
  {
    symbole: "⋮",
    titre: "Changer de recueil (en haut à droite)",
    points: [
      "Touchez les 3 points ⋮ pour ouvrir la liste des recueils.",
      "Choisissez Lingala, Swahili, Tshiluba ou Crois seulement (français).",
      "Le recueil déjà affiché n'apparaît pas dans ce menu.",
    ],
  },
  {
    symbole: "🔎",
    titre: "Rechercher un cantique",
    points: [
      "Tapez le numéro du cantique (ex. 125) ou une partie du titre.",
      "La recherche porte uniquement sur le numéro et le titre.",
      "La liste se filtre au fur et à mesure de la saisie.",
      "Effacez le texte pour revoir toute la liste.",
    ],
  },
  {
    symbole: "🎵",
    titre: "Lire le texte d'un cantique",
    points: [
      "Touchez le titre : le texte complet s'ouvre sur une nouvelle page.",
      "Les refrains (Refrain, Kolus…) sont automatiquement en gras et italique.",
      "Dans les recueils Lingala, Swahili et Tshiluba, la référence française est indiquée en bleu sous le titre, dans la liste.",
      "◀ La flèche en haut à gauche ramène à la liste du même recueil.",
    ],
  },
  {
    symbole: "‹ ›",
    titre: "Passer d'un cantique à l'autre",
    points: [
      "En bas de la page d'un cantique, ‹ ouvre le cantique précédent.",
      "› ouvre le cantique suivant, sans revenir à la liste.",
    ],
  },
  {
    symbole: "↗",
    titre: "Partager un cantique",
    points: [
      "Le bouton bleu de partage se trouve à côté du titre du cantique.",
      "Le message partagé contient le numéro et le nom, le texte, puis la mention du Recueil des chants du Tabernacle de l'Espérance Kinshasa-Matete.",
      "Vous pouvez l'envoyer par WhatsApp, e-mail ou tout autre application.",
    ],
  },
  {
    symbole: "📖",
    titre: "Le livre du conducteur",
    points: [
      "Créez une liste : tapez son nom (ex. Culte du dimanche) puis touchez ➕.",
      "Ouvrez la liste et ajoutez les cantiques un par un.",
      "Lisez ensuite les chants l'un après l'autre pendant le culte.",
      "🔎 La barre de recherche retrouve une liste par son nom ou par un numéro de chant qu'elle contient.",
      "🗑 L'icône corbeille supprime une liste.",
    ],
  },
  {
    symbole: "⚙️",
    titre: "Adapter l'affichage",
    points: [
      "Choisissez le style de police qui vous convient.",
      "Agrandissez ou réduisez la taille du texte.",
      "🌙 Mode nuit / ☀️ Mode jour selon la luminosité.",
    ],
  },
  {
    symbole: "📶",
    titre: "Hors ligne et mises à jour",
    points: [
      "Tous les cantiques sont enregistrés dans le téléphone : l'application fonctionne sans internet.",
      "Dès que vous êtes connecté, les nouveaux cantiques se téléchargent automatiquement.",
      "⬇️ Un bandeau s'affiche en haut lorsqu'une mise à jour est disponible.",
    ],
  },
  {
    symbole: "📲",
    titre: "Installer l'application",
    points: [
      "Dans le menu ☰, touchez le bouton d'installation en bas.",
      "L'icône du recueil s'ajoute alors à l'écran d'accueil du téléphone.",
    ],
  },
];

function Aide() {
  return (
    <AppShell title="Aide" backTo="/">
      <p className="text-muted-foreground mb-5 text-sm">
        Guide détaillé d'utilisation du recueil. Les symboles ci-dessous correspondent aux boutons
        de l'application.
      </p>
      <ol className="space-y-4">
        {etapes.map((e) => (
          <li key={e.titre} className="bg-card shadow-soft rounded-lg border p-4">
            <h2 className="font-display flex items-center gap-2 text-lg font-semibold">
              <span aria-hidden className="text-primary text-xl">
                {e.symbole}
              </span>
              {e.titre}
            </h2>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed">
              {e.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span aria-hidden className="text-primary">
                    •
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </AppShell>
  );
}
