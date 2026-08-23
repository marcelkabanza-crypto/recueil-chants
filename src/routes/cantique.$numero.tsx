import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { CantiqueTexte } from "@/components/CantiqueTexte";
import { ShareButton } from "@/components/ShareButton";
import { Button } from "@/components/ui/button";
import { useCantiques } from "@/lib/cantiques-store";
import { isLangue, langueDe, type Langue } from "@/lib/langues";

export const Route = createFileRoute("/cantique/$numero")({
  head: ({ params }) => {
    const title = `Cantique ${params.numero} — Recueil des Chants TESP`;
    const description = `Texte complet du cantique ${params.numero} du Tabernacle de l'Espérance.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  validateSearch: (search: Record<string, unknown>): { langue: Langue } => {
    const l = typeof search["langue"] === "string" ? search["langue"] : "fr";
    return { langue: isLangue(l) ? l : "fr" };
  },
  component: CantiquePage,
});

function CantiquePage() {
  const { numero } = Route.useParams();
  const { langue } = Route.useSearch();
  const { cantiques } = useCantiques();
  const liste = cantiques.filter((c) => langueDe(c) === langue);
  const cantique = liste.find((c) => c.numero === Number(numero));

  if (!cantique) {
    return (
      <AppShell title="Cantique introuvable" backTo="/">
        <p className="text-muted-foreground text-sm">
          Ce cantique n'existe pas dans le recueil.
        </p>
      </AppShell>
    );
  }

  const index = liste.findIndex((c) => c.numero === cantique.numero);
  const prev = liste[index - 1];
  const next = liste[index + 1];

  return (
    <AppShell title={`Cantique ${cantique.numero}`} backTo="/">
      <article>
        <h2 className="font-display text-2xl font-semibold leading-tight">
          {cantique.numero}. {cantique.nom}
        </h2>
        <div className="bg-accent mt-3 h-px w-16" />
        <CantiqueTexte texte={cantique.texte} className="mt-5" />
      </article>

      <div className="mt-8 flex items-center justify-between gap-2">
        {prev ? (
          <Button asChild variant="outline" size="sm">
            <Link to="/cantique/$numero" params={{ numero: String(prev.numero) }} search={{ langue }}>
              <ChevronLeft /> {prev.numero}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next ? (
          <Button asChild variant="outline" size="sm">
            <Link to="/cantique/$numero" params={{ numero: String(next.numero) }} search={{ langue }}>
              {next.numero} <ChevronRight />
            </Link>
          </Button>
        ) : (
          <span />
        )}
      </div>

      <ShareButton
        cantique={cantique}
        size="icon"
        className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg"
      />
    </AppShell>
  );
}
