import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Play,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { CantiqueTexte } from "@/components/CantiqueTexte";
import { ShareButton } from "@/components/ShareButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCantiques } from "@/lib/cantiques-store";
import { usePlaylists } from "@/lib/playlists";

export const Route = createFileRoute("/liste/$id")({
  head: () => ({
    meta: [
      { title: "Ma liste de chants — Recueil des Chants TESP" },
      {
        name: "description",
        content:
          "Composez votre liste de cantiques et lisez-les l'un après l'autre pendant la conduite du culte.",
      },
      { property: "og:title", content: "Ma liste de chants — Recueil TESP" },
      {
        property: "og:description",
        content: "Liste de chants personnelle du conducteur, disponible hors connexion.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ListePage,
});

function ListePage() {
  const { id } = Route.useParams();
  const { lists, addChant, removeChant, moveChant } = usePlaylists();
  const { cantiques, getCantique } = useCantiques();
  const liste = lists.find((l) => l.id === id);

  const [q, setQ] = useState("");
  const [lecture, setLecture] = useState<number | null>(null);

  const chants = useMemo(
    () => (liste?.numeros ?? []).map((n) => getCantique(n)).filter(Boolean),
    [liste, getCantique],
  );

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const base = cantiques.filter((c) => !liste?.numeros.includes(c.numero));
    // Sans recherche : uniquement le recueil français (comme la page d'accueil).
    if (!term) return base.filter((c) => langueDe(c) === "fr");
    // Recherche globale : toutes les versions, sur le numéro et le titre.
    return base.filter(
      (c) => c.nom.toLowerCase().includes(term) || String(c.numero).startsWith(term),
    );
  }, [q, liste, cantiques]);

  if (!liste) {
    return (
      <AppShell title="Liste introuvable" backTo="/livre-du-conducteur">
        <p className="text-muted-foreground text-sm">Cette liste n'existe plus sur cet appareil.</p>
      </AppShell>
    );
  }

  if (lecture !== null && chants[lecture]) {
    const chant = chants[lecture]!;
    return (
      <AppShell title={`${liste.nom} · ${lecture + 1}/${chants.length}`} backTo="/livre-du-conducteur">
        <Button variant="ghost" size="sm" className="mb-3" onClick={() => setLecture(null)}>
          <X /> Quitter la lecture
        </Button>
        <article>
          <h2 className="font-display text-2xl font-semibold leading-tight">
            {chant.numero}. {chant.nom}
          </h2>
          <div className="bg-accent mt-3 h-px w-16" />
          <CantiqueTexte texte={chant.texte} className="mt-5" />
        </article>
        <div className="mt-8 flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={lecture === 0}
            onClick={() => setLecture(lecture - 1)}
          >
            <ChevronLeft /> Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={lecture >= chants.length - 1}
            onClick={() => setLecture(lecture + 1)}
          >
            Suivant <ChevronRight />
          </Button>
        </div>

        <ShareButton
          cantique={chant}
          size="icon"
          className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg"
        />
      </AppShell>
    );
  }

  return (
    <AppShell title={liste.nom} backTo="/livre-du-conducteur">
      <div className="flex items-center justify-between gap-2">
        <p className="text-muted-foreground text-sm">
          {chants.length} chant{chants.length > 1 ? "s" : ""} dans la liste
        </p>
        <Button size="sm" disabled={chants.length === 0} onClick={() => setLecture(0)}>
          <Play /> Lire la liste
        </Button>
      </div>

      <ul className="mt-4 space-y-2">
        {chants.map((c, i) => (
          <li
            key={c!.numero}
            className="bg-card shadow-soft flex items-center gap-2 rounded-lg border p-2"
          >
            <button
              type="button"
              onClick={() => setLecture(i)}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <span className="bg-primary text-primary-foreground font-display flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                {c!.numero}
              </span>
              <span className="font-display truncate text-base">{c!.nom}</span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Monter"
              disabled={i === 0}
              onClick={() => moveChant(liste.id, i, -1)}
            >
              <ArrowUp />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Descendre"
              disabled={i === chants.length - 1}
              onClick={() => moveChant(liste.id, i, 1)}
            >
              <ArrowDown />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Retirer de la liste"
              onClick={() => removeChant(liste.id, c!.numero)}
            >
              <Trash2 />
            </Button>
          </li>
        ))}
      </ul>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold">Ajouter un chant</h2>
        <div className="relative mt-3">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un cantique ou un numéro"
            className="pl-9"
            aria-label="Rechercher un cantique à ajouter"
          />
        </div>
        <ul className="mt-3 space-y-2">
          {results.map((c) => (
            <li
              key={c.numero}
              className="bg-card flex items-center gap-3 rounded-lg border p-2"
            >
              <span className="text-muted-foreground w-8 text-center text-sm">{c.numero}</span>
              <span className="font-display min-w-0 flex-1 truncate text-base">{c.nom}</span>
              <Button
                variant="outline"
                size="icon"
                aria-label={`Ajouter ${c.nom}`}
                onClick={() => addChant(liste.id, c.numero)}
              >
                <Plus />
              </Button>
            </li>
          ))}
        </ul>
        {results.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm">
            Tous les cantiques trouvés sont déjà dans la liste.
          </p>
        ) : null}
        <div className="mt-6">
          <Link to="/" className="text-primary text-sm underline">
            Voir tout le recueil
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
