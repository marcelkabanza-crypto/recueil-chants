import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { AppShell } from "@/components/AppShell";
import { CantiqueListe } from "@/components/CantiqueListe";
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
  const code = isLangue(langue) ? langue : "fr";

  const liste = useMemo(
    () => cantiques.filter((c) => langueDe(c) === code),
    [cantiques, code],
  );

  return (
    <AppShell title={labelLangue(code)} backTo="/">
      <p className="text-muted-foreground mb-3 text-sm">
        {liste.length} cantique{liste.length > 1 ? "s" : ""}
      </p>
      <CantiqueListe cantiques={liste} />
    </AppShell>
  );
}
