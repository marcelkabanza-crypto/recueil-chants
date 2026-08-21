import { createFileRoute } from "@tanstack/react-router";
import { Check, Share2, Youtube } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useCantiques } from "@/lib/cantiques-store";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — Recueil des Chants TESP" },
      {
        name: "description",
        content:
          "Le Recueil des Chants TESP rassemble les cantiques du Tabernacle de l'Espérance pour l'assemblée et les conducteurs de chants.",
      },
      { property: "og:title", content: "À propos — Recueil des Chants TESP" },
      {
        property: "og:description",
        content: "L'application des cantiques du Tabernacle de l'Espérance.",
      },
    ],
  }),
  component: APropos,
});

function APropos() {
  return (
    <AppShell title="À propos" backTo="/">
      <section className="bg-card shadow-soft rounded-lg border p-5 text-center">
        <p className="font-display text-2xl font-semibold">Recueil des Chants TESP</p>
        <p className="text-muted-foreground mt-1 text-sm">Tabernacle de l'Espérance</p>
        <p className="text-muted-foreground mt-4 text-xs">
          Version 1.0 — {cantiques.length} cantiques
        </p>
      </section>

      <section className="bg-card shadow-soft mt-4 rounded-lg border p-4">
        <h2 className="font-display text-lg font-semibold">Notre mission</h2>
        <p className="mt-1 text-sm leading-relaxed">
          Cette application met les cantiques du Tabernacle de l'Espérance à la portée de chaque
          membre : numéro, nom et texte complet, disponibles à tout moment pendant le culte,
          la prière ou la méditation personnelle. Les nouveaux cantiques sont ajoutés lors des
          mises à jour de l'application.
        </p>
      </section>

      <Button asChild className="mt-4 w-full">
        <a
          href="https://www.youtube.com/@TabEsperance"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Youtube /> Notre chaîne YouTube
        </a>
      </Button>
    </AppShell>
  );
}
