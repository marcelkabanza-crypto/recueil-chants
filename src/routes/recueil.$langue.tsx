import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { CantiqueListe } from "@/components/CantiqueListe";
import { NouveauCantique } from "@/components/NouveauCantique";
import { Input } from "@/components/ui/input";
import { useCantiques } from "@/lib/cantiques-store";
import { isLangue, labelLangue, langueDe } from "@/lib/langues";

export const Route = createFileRoute("/recueil/$langue")({
  head: ({ params }) => {
    const code = isLangue(params.langue) ? params.langue : "fr";
    const titre = `${labelLangue(code)} — Recueil des Chants TESP`;
    const description = `Liste des cantiques du Tabernacle de l'Espérance : ${labelLangue(code)}.`;
    return {
      meta: [
        { title: titre },
        { name: "description", content: description },
        { property: "og:title", content: titre },
        { property: "og:description", content: description },
      ],
    };
  },
  component: RecueilPage,
});

function RecueilPage() {
  const { langue } = Route.useParams();
  const { cantiques } = useCantiques();
  const [q, setQ] = useState("");
  const code = isLangue(langue) ? langue : "fr";

  const liste = useMemo(() => {
    const duRecueil = cantiques.filter((c) => langueDe(c) === code);
    const term = q.trim().toLowerCase();
    if (!term) return duRecueil;
    // Recherche uniquement sur le numéro et le titre du cantique.
    return duRecueil.filter(
      (c) => c.nom.toLowerCase().includes(term) || String(c.numero).startsWith(term),
    );
  }, [cantiques, code, q]);


  return (
    <AppShell title={labelLangue(code)} backTo="/" langueCourante={code}>
      <div className="relative mb-5">
        <Search className="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher dans ce recueil"
          className="h-12 pl-10 text-base"
          inputMode="text"
          aria-label="Rechercher un cantique"
        />
      </div>

      <NouveauCantique langue={code} />
      <p className="text-muted-foreground mb-3 text-sm">
        {liste.length} cantique{liste.length > 1 ? "s" : ""}
      </p>
      <CantiqueListe cantiques={liste} />
    </AppShell>
  );
}
