import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/livre-du-conducteur")({
  head: () => ({
    meta: [
      { title: "Livre du conducteur — Recueil des Chants TESP" },
      {
        name: "description",
        content:
          "Repères pour le conducteur de chants du Tabernacle Espérance : conduite du culte, choix des cantiques et discipline de louange.",
      },
      { property: "og:title", content: "Livre du conducteur — Recueil TESP" },
      {
        property: "og:description",
        content: "Guide du conducteur de chants du Tabernacle Espérance.",
      },
    ],
  }),
  component: LivreConducteur,
});

const sections = [
  {
    titre: "Préparation spirituelle",
    texte:
      "Le conducteur se prépare d'abord dans la prière. Il demande la direction de l'Esprit avant de choisir les cantiques, car la louange n'est pas une performance mais un service.",
  },
  {
    titre: "Choix des cantiques",
    texte:
      "Choisir des cantiques qui s'accordent au thème du culte : adoration au début, cantiques d'édification avant la prédication, cantiques d'appel et de consécration à la fin.",
  },
  {
    titre: "Conduite de l'assemblée",
    texte:
      "Annoncer clairement le numéro et le nom du cantique, laisser à l'assemblée le temps de le retrouver, garder un tempo régulier et une tonalité chantable par tous.",
  },
  {
    titre: "Discipline et attitude",
    texte:
      "Rester sobre dans les gestes et les paroles, éviter les longues explications entre les chants, et diriger le regard de l'assemblée vers le Seigneur et non vers l'estrade.",
  },
  {
    titre: "Après le culte",
    texte:
      "Noter les cantiques utilisés, évaluer ce qui a édifié l'assemblée et former les jeunes conducteurs afin que le service continue.",
  },
];

function LivreConducteur() {
  return (
    <AppShell title="Livre du conducteur" backTo="/">
      <p className="text-muted-foreground mb-5 text-sm">
        Repères pratiques pour celui qui conduit les chants au Tabernacle Espérance.
      </p>
      <div className="space-y-4">
        {sections.map((s) => (
          <section key={s.titre} className="bg-card shadow-soft rounded-lg border p-4">
            <h2 className="font-display text-lg font-semibold">{s.titre}</h2>
            <p className="mt-1 text-sm leading-relaxed">{s.texte}</p>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
