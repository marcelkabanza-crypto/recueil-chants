import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { cantiques, getCantique } from "@/data/cantiques";

export const Route = createFileRoute("/cantique/$numero")({
  loader: ({ params }) => {
    const cantique = getCantique(Number(params.numero));
    if (!cantique) throw notFound();
    return { cantique };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Cantique introuvable — TESP" }, { name: "robots", content: "noindex" }],
      };
    }
    const { cantique } = loaderData;
    const title = `${cantique.numero}. ${cantique.nom} — Recueil TESP`;
    const description = `Texte du cantique ${cantique.numero} « ${cantique.nom} » du Tabernacle Espérance.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CantiquePage,
  notFoundComponent: () => (
    <AppShell title="Cantique introuvable" backTo="/">
      <p className="text-muted-foreground text-sm">
        Ce cantique n'existe pas dans le recueil.
      </p>
    </AppShell>
  ),
});

function CantiquePage() {
  const { cantique } = Route.useLoaderData();
  const index = cantiques.findIndex((c) => c.numero === cantique.numero);
  const prev = cantiques[index - 1];
  const next = cantiques[index + 1];

  return (
    <AppShell title={`Cantique ${cantique.numero}`} backTo="/">
      <article>
        <h2 className="font-display text-2xl font-semibold leading-tight">
          {cantique.numero}. {cantique.nom}
        </h2>
        <div className="bg-accent mt-3 h-px w-16" />
        <div className="cantique-text mt-5">{cantique.texte}</div>
      </article>

      <div className="mt-8 flex items-center justify-between gap-2">
        {prev ? (
          <Button asChild variant="outline" size="sm">
            <Link to="/cantique/$numero" params={{ numero: String(prev.numero) }}>
              <ChevronLeft /> {prev.numero}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next ? (
          <Button asChild variant="outline" size="sm">
            <Link to="/cantique/$numero" params={{ numero: String(next.numero) }}>
              {next.numero} <ChevronRight />
            </Link>
          </Button>
        ) : (
          <span />
        )}
      </div>
    </AppShell>
  );
}
