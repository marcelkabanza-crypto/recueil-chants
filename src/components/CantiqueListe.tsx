import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";

import { ModifierCantique } from "@/components/ModifierCantique";
import type { Cantique } from "@/data/cantiques";
import { useAuth } from "@/lib/auth";
import { langueDe } from "@/lib/langues";
import { useSettings } from "@/lib/settings";

export function CantiqueListe({ cantiques }: { cantiques: Cantique[] }) {
  const { isAdmin } = useAuth();
  const { adminUnlocked } = useSettings();
  const peutModifier = isAdmin || adminUnlocked;
  const [enEdition, setEnEdition] = useState<Cantique | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPress = useRef(false);

  const annuler = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const demarrer = (c: Cantique) => {
    if (!peutModifier) return;
    longPress.current = false;
    annuler();
    timer.current = setTimeout(() => {
      longPress.current = true;
      setEnEdition(c);
    }, 550);
  };

  if (cantiques.length === 0) {
    return (
      <p className="text-muted-foreground py-10 text-center text-sm">
        Aucun cantique disponible pour le moment.
      </p>
    );
  }

  return (
    <>
      <ul className="space-y-2">
        {cantiques.map((c) => (
          <li key={`${langueDe(c)}-${c.numero}`}>
            <Link
              to="/cantique/$numero"
              params={{ numero: String(c.numero) }}
              search={{ langue: langueDe(c) }}
              onPointerDown={() => demarrer(c)}
              onPointerUp={annuler}
              onPointerLeave={annuler}
              onPointerCancel={annuler}
              onContextMenu={(e) => {
                if (peutModifier) e.preventDefault();
              }}
              onClick={(e) => {
                if (longPress.current) {
                  e.preventDefault();
                  longPress.current = false;
                }
              }}
              className="bg-card shadow-soft hover:border-accent flex min-h-16 items-center gap-3 rounded-lg border p-3 transition-colors select-none active:opacity-80"
            >
              <span className="bg-primary text-primary-foreground font-display flex size-11 shrink-0 items-center justify-center rounded-full text-base font-semibold">
                {c.numero}
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-display block truncate overflow-hidden text-ellipsis whitespace-nowrap text-lg leading-snug">
                  {c.nom}
                </span>
                {c.reference?.trim() ? (
                  <span className="text-primary block truncate text-xs font-medium">
                    REFERENCE FRANCAIS : {c.reference.trim()}
                  </span>
                ) : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {peutModifier && (
        <ModifierCantique cantique={enEdition} onClose={() => setEnEdition(null)} />
      )}
    </>
  );
}
