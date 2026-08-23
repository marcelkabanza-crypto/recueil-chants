import { Link } from "@tanstack/react-router";

import type { Cantique } from "@/data/cantiques";
import { langueDe } from "@/lib/langues";

export function CantiqueListe({ cantiques }: { cantiques: Cantique[] }) {
  if (cantiques.length === 0) {
    return (
      <p className="text-muted-foreground py-10 text-center text-sm">
        Aucun cantique disponible pour le moment.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {cantiques.map((c) => (
        <li key={`${langueDe(c)}-${c.numero}`}>
          <Link
            to="/cantique/$numero"
            params={{ numero: String(c.numero) }}
            search={{ langue: langueDe(c) }}
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
  );
}
