import { createFileRoute } from "@tanstack/react-router";
import { CloudUpload, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useCantiques } from "@/lib/cantiques-store";

export const Route = createFileRoute("/_authenticated/administration")({
  head: () => ({
    meta: [
      { title: "Administration — Recueil des Chants TESP" },
      {
        name: "description",
        content:
          "Espace réservé à l'administrateur : ajout, modification et publication des cantiques du Tabernacle de l'Espérance.",
      },
      { property: "og:title", content: "Administration — Recueil des Chants TESP" },
      {
        property: "og:description",
        content: "Gestion des cantiques et publication des mises à jour.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Administration,
});

function Administration() {
  const { isAdmin, loading } = useAuth();
  const { cantiques, version, sync, syncing } = useCantiques();

  const [numero, setNumero] = useState("");
  const [nom, setNom] = useState("");
  const [texte, setTexte] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const resetForm = () => {
    setEditing(null);
    setNumero("");
    setNom("");
    setTexte("");
  };

  if (loading) {
    return (
      <AppShell title="Administration" backTo="/">
        <p className="text-muted-foreground text-sm">Chargement…</p>
      </AppShell>
    );
  }

  if (!isAdmin) {
    return (
      <AppShell title="Administration" backTo="/">
        <section className="bg-card shadow-soft rounded-lg border p-5">
          <h2 className="font-display text-lg font-semibold">Accès réservé</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Seul l'administrateur de l'application peut ajouter, modifier ou supprimer un
            cantique. Votre compte est un compte membre : vous pouvez consulter tous les
            cantiques et créer vos listes de chants.
          </p>
        </section>
      </AppShell>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(numero);
    if (!num || !nom.trim() || !texte.trim()) {
      toast.error("Numéro, nom et texte sont obligatoires.");
      return;
    }
    setBusy(true);
    const payload = { numero: num, nom: nom.trim(), texte: texte.trim() };
    const { error } =
      editing !== null
        ? await supabase.from("cantiques").update(payload).eq("numero", editing)
        : await supabase.from("cantiques").insert(payload);
    setBusy(false);

    if (error) {
      toast.error(
        error.message.includes("duplicate")
          ? "Ce numéro de cantique existe déjà."
          : "Enregistrement impossible : " + error.message,
      );
      return;
    }
    toast.success(editing !== null ? "Cantique modifié." : "Cantique ajouté.");
    resetForm();
    await sync({ force: true });
  };

  const remove = async (num: number) => {
    const { error } = await supabase.from("cantiques").delete().eq("numero", num);
    if (error) {
      toast.error("Suppression impossible : " + error.message);
      return;
    }
    toast.success("Cantique supprimé.");
    if (editing === num) resetForm();
    await sync({ force: true });
  };

  const publish = async () => {
    setBusy(true);
    const { error } = await supabase
      .from("recueil_version")
      .update({ version: version + 1, published_at: new Date().toISOString() })
      .eq("id", 1);
    setBusy(false);
    if (error) {
      toast.error("Publication impossible : " + error.message);
      return;
    }
    await sync({ force: true });
    toast.success(
      "Mise à jour publiée. Les membres la recevront dès qu'ils seront connectés à Internet.",
    );
  };

  return (
    <AppShell title="Administration" backTo="/">
      <section className="bg-card shadow-soft rounded-lg border p-4">
        <h2 className="font-display text-lg font-semibold">Mise à jour du recueil</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Version actuelle : {version} — {cantiques.length} cantiques. Après vos ajouts,
          publiez la mise à jour : les téléphones des membres la téléchargeront
          automatiquement dès qu'ils auront Internet.
        </p>
        <Button className="mt-3 w-full" onClick={publish} disabled={busy || syncing}>
          <CloudUpload /> Mise à jour
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full"
          onClick={() => void sync({ force: true })}
          disabled={syncing}
        >
          <RefreshCw /> Recharger depuis la base
        </Button>
      </section>

      <section className="bg-card shadow-soft mt-4 rounded-lg border p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold">
            {editing !== null ? `Modifier le cantique ${editing}` : "Ajouter un cantique"}
          </h2>
          {editing !== null ? (
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <X /> Annuler
            </Button>
          ) : null}
        </div>

        <form onSubmit={submit} className="mt-3 space-y-3">
          <div>
            <Label htmlFor="numero">Numéro</Label>
            <Input
              id="numero"
              type="number"
              min={1}
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="nom">Nom du cantique</Label>
            <Input
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="texte">Texte (couplets et refrain)</Label>
            <Textarea
              id="texte"
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
              rows={10}
              className="mt-1"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            <Plus /> {editing !== null ? "Enregistrer les modifications" : "Ajouter le cantique"}
          </Button>
        </form>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-lg font-semibold">Cantiques enregistrés</h2>
        <ul className="mt-3 space-y-2">
          {cantiques.map((c) => (
            <li
              key={c.numero}
              className="bg-card shadow-soft flex items-center gap-2 rounded-lg border p-2"
            >
              <span className="text-muted-foreground w-8 text-center text-sm">{c.numero}</span>
              <span className="font-display min-w-0 flex-1 truncate text-base">{c.nom}</span>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Modifier ${c.nom}`}
                onClick={() => {
                  setEditing(c.numero);
                  setNumero(String(c.numero));
                  setNom(c.nom);
                  setTexte(c.texte);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <Pencil />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Supprimer ${c.nom}`}
                onClick={() => void remove(c.numero)}
              >
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
