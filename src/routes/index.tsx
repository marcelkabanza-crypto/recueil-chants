import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { CantiqueListe } from "@/components/CantiqueListe";
import { InstallButton } from "@/components/InstallButton";
import { NouveauCantique } from "@/components/NouveauCantique";
import { Input } from "@/components/ui/input";
import { useCantiques } from "@/lib/cantiques-store";
import { langueDe } from "@/lib/langues";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Recueil des Chants TESP — Cantiques du Tabernacle de l'Espérance" },
      {
        name: "description",
        content:
          "Consultez et recherchez les cantiques du Tabernacle de l'Espérance : numéro, nom et texte complet, hors connexion.",
      },
      { property: "og:title", content: "Recueil des Chants TESP" },
      {
        property: "og:description",
        content: "Tous les cantiques du Tabernacle de l'Espérance dans une seule application.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [q, setQ] = useState("");
  const { cantiques } = useCantiques();

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    // Sans recherche : uniquement le recueil français.
    if (!term) return cantiques.filter((c) => langueDe(c) === "fr");
    // Avec recherche : toutes les versions (français, lingala, swahili, tshiluba).
    return cantiques.filter(
      (c) =>
        c.nom.toLowerCase().includes(term) ||
        c.texte.toLowerCase().includes(term) ||
        String(c.numero) === term ||
        String(c.numero).startsWith(term),
    );
  }, [q, cantiques]);

  return (
    <AppShell title="Recueil des Chants TESP" langueCourante="fr">
      <InstallButton className="mb-4 w-full" />

      <div className="relative mb-5">
        <Search className="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher dans toutes les versions"
          className="h-12 pl-10 text-base"
          inputMode="text"
          aria-label="Rechercher un cantique"
        />
      </div>

      <NouveauCantique langue="fr" />

      <p className="text-muted-foreground mb-3 text-sm">
        {results.length} cantique{results.length > 1 ? "s" : ""}
      </p>

      <CantiqueListe cantiques={results} />
    </AppShell>
  );
}
