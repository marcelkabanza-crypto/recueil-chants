import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { InstallButton } from "@/components/InstallButton";
import { Input } from "@/components/ui/input";
import { useCantiques } from "@/lib/cantiques-store";

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
    if (!term) return cantiques;
    return cantiques.filter(
      (c) =>
        c.nom.toLowerCase().includes(term) ||
        String(c.numero) === term ||
        String(c.numero).startsWith(term),
    );
  }, [q, cantiques]);

  return (
    <AppShell title="Recueil des Chants TESP">
      <InstallButton className="mb-4 w-full" />

      <div className="relative mb-5">
        <Search className="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un cantique ou un numéro"
          className="h-12 pl-10 text-base"
          inputMode="text"
          aria-label="Rechercher un cantique"
        />
      </div>

      <p className="text-muted-foreground mb-3 text-sm">
        {results.length} cantique{results.length > 1 ? "s" : ""}
      </p>

      <ul className="space-y-2">
        {results.map((c) => (
          <li key={c.numero}>
            <Link
              to="/cantique/$numero"
              params={{ numero: String(c.numero) }}
              className="bg-card shadow-soft hover:border-accent flex min-h-16 items-center gap-3 rounded-lg border p-3 transition-colors active:opacity-80"
            >
              <span className="bg-primary text-primary-foreground font-display flex size-11 shrink-0 items-center justify-center rounded-full text-base font-semibold">
                {c.numero}
              </span>
              <span className="font-display text-lg leading-snug">{c.nom}</span>
            </Link>
          </li>
        ))}
      </ul>

      {results.length === 0 ? (
        <p className="text-muted-foreground py-10 text-center text-sm">
          Aucun cantique ne correspond à votre recherche.
        </p>
      ) : null}
    </AppShell>
  );
}
