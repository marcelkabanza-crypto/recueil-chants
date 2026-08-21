import { createFileRoute, Link } from "@tanstack/react-router";
import { ListMusic, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePlaylists } from "@/lib/playlists";

export const Route = createFileRoute("/livre-du-conducteur")({
  head: () => ({
    meta: [
      { title: "Livre du conducteur — Recueil des Chants TESP" },
      {
        name: "description",
        content:
          "Créez vos listes de chants et conduisez le culte : ajout des cantiques un par un, lecture enchaînée et repères pour le conducteur.",
      },
      { property: "og:title", content: "Livre du conducteur — Recueil TESP" },
      {
        property: "og:description",
        content: "Listes de chants et guide du conducteur du Tabernacle de l'Espérance.",
      },
    ],
  }),
  component: LivreConducteur,
});

const sections = [
  {
    titre: "Préparation spirituelle",
    texte:
      "Le conducteur se prépare d'abord dans la prière. Il demande la direction de l'Esprit avant de choisir les cantiques, car la louange n'est pas une performance mais un service.",
  },
  {
    titre: "Choix des cantiques",
    texte:
      "Choisir des cantiques qui s'accordent au thème du culte : adoration au début, cantiques d'édification avant la prédication, cantiques d'appel et de consécration à la fin.",
  },
  {
    titre: "Conduite de l'assemblée",
    texte:
      "Annoncer clairement le numéro et le nom du cantique, laisser à l'assemblée le temps de le retrouver, garder un tempo régulier et une tonalité chantable par tous.",
  },
  {
    titre: "Discipline et attitude",
    texte:
      "Rester sobre dans les gestes et les paroles, éviter les longues explications entre les chants, et diriger le regard de l'assemblée vers le Seigneur et non vers l'estrade.",
  },
  {
    titre: "Après le culte",
    texte:
      "Noter les cantiques utilisés, évaluer ce qui a édifié l'assemblée et former les jeunes conducteurs afin que le service continue.",
  },
];

function LivreConducteur() {
  const { lists, createList, deleteList } = usePlaylists();
  const [nom, setNom] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) return;
    createList(nom);
    setNom("");
  };

  return (
    <AppShell title="Livre du conducteur" backTo="/">
      <section>
        <h2 className="font-display text-xl font-semibold">Mes listes de chants</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Créez une liste, ajoutez les cantiques un par un, puis lisez-les l'un après l'autre.
        </p>

        <form onSubmit={submit} className="mt-4 flex gap-2">
          <Input
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Nom de la liste (ex. Culte du dimanche)"
            aria-label="Nom de la nouvelle liste"
          />
          <Button type="submit" aria-label="Créer la liste">
            <Plus />
          </Button>
        </form>

        <ul className="mt-4 space-y-2">
          {lists.map((l) => (
            <li
              key={l.id}
              className="bg-card shadow-soft flex items-center gap-3 rounded-lg border p-3"
            >
              <Link
                to="/liste/$id"
                params={{ id: l.id }}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                <span className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full">
                  <ListMusic className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="font-display block truncate text-lg leading-snug">{l.nom}</span>
                  <span className="text-muted-foreground text-xs">
                    {l.numeros.length} chant{l.numeros.length > 1 ? "s" : ""}
                  </span>
                </span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Supprimer la liste ${l.nom}`}
                onClick={() => deleteList(l.id)}
              >
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>

        {lists.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm">
            Aucune liste pour le moment.
          </p>
        ) : null}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">Repères du conducteur</h2>
        <div className="mt-4 space-y-4">
          {sections.map((s) => (
            <article key={s.titre} className="bg-card shadow-soft rounded-lg border p-4">
              <h3 className="font-display text-lg font-semibold">{s.titre}</h3>
              <p className="mt-1 text-sm leading-relaxed">{s.texte}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
