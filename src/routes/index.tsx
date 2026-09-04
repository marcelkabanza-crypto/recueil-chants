import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { CantiqueListe } from "@/components/CantiqueListe";
import { InstallButton } from "@/components/InstallButton";
import { NouveauCantique } from "@/components/NouveauCantique";
import { Input } from "@/components/ui/input";
import { useCantiques } from "@/lib/cantiques-store";
import { langueDe } from "@/lib/langues";
import logoAsset from "@/assets/logo-tabernacle-white.png.asset.json";

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

function SplashScreen({ onFinished }: { onFinished: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onFinished, 3000);
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className="bg-splash-bg fixed inset-0 z-50 flex flex-col items-center justify-center p-6">
      <img
        src={logoAsset.url}
        alt="Tabernacle de l'Espérance"
        className="max-h-[60vh] w-auto max-w-full animate-in fade-in zoom-in duration-700"
      />
      <p className="mt-6 text-center font-display text-lg text-white/90">
        Recueil des Chants TESP
      </p>
      <p className="text-gold mt-1 text-center text-sm">Tabernacle de l'Espérance</p>
    </div>
  );
}

function Index() {
  const [q, setQ] = useState("");
  const [showSplash, setShowSplash] = useState(true);
  const { cantiques } = useCantiques();

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    // Sans recherche : uniquement le recueil français.
    if (!term) return cantiques.filter((c) => langueDe(c) === "fr");
    // Recherche uniquement sur le numéro et le titre, toutes versions confondues.
    return cantiques.filter(
      (c) => c.nom.toLowerCase().includes(term) || String(c.numero).startsWith(term),
    );
  }, [q, cantiques]);

  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }

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
