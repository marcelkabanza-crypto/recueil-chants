import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { Cantique } from "@/data/cantiques";
import { useCantiques } from "@/lib/cantiques-store";
import { labelLangue, langueDe } from "@/lib/langues";

const nomLangue = (code: string) => labelLangue(code as never);

/**
 * Modification d'un cantique (réservé au concepteur).
 * Ouvert par un appui long sur le titre dans la liste.
 */
export function ModifierCantique({
  cantique,
  onClose,
}: {
  cantique: Cantique | null;
  onClose: () => void;
}) {
  const { sync } = useCantiques();
  const [nom, setNom] = useState("");
  const [texte, setTexte] = useState("");
  const [reference, setReference] = useState("");
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    if (cantique) {
      setNom(cantique.nom);
      setTexte(cantique.texte);
      setReference(cantique.reference ?? "");
    }
  }, [cantique]);

  const enregistrer = async () => {
    if (!cantique) return;
    if (!nom.trim() || !texte.trim()) {
      toast.error("Le nom et le texte sont obligatoires");
      return;
    }
    setEnvoi(true);
    const { error } = await supabase
      .from("cantiques")
      .update({
        nom: nom.trim(),
        texte: texte.trim(),
        reference: reference.trim() || null,
      })
      .eq("numero", cantique.numero)
      .eq("langue", langueDe(cantique));

    if (error) {
      setEnvoi(false);
      toast.error("Modification impossible", { description: error.message });
      return;
    }

    // Nouvelle version : les utilisateurs recevront la correction.
    await publierVersion();

    await sync({ force: true });
    setEnvoi(false);
    onClose();
    toast.success("Cantique modifié");
  };

  const publierVersion = async () => {
    const { data: v } = await supabase
      .from("recueil_version")
      .select("version")
      .eq("id", 1)
      .maybeSingle();
    await supabase
      .from("recueil_version")
      .update({ version: (v?.version ?? 0) + 1, published_at: new Date().toISOString() })
      .eq("id", 1);
  };

  const supprimer = async () => {
    if (!cantique) return;
    if (!window.confirm(`Supprimer definitivement le cantique ${cantique.numero} ?`)) return;
    setEnvoi(true);
    const { error } = await supabase
      .from("cantiques")
      .delete()
      .eq("numero", cantique.numero)
      .eq("langue", langueDe(cantique));
    if (error) {
      setEnvoi(false);
      toast.error("Suppression impossible", { description: error.message });
      return;
    }
    await publierVersion();
    await sync({ force: true });
    setEnvoi(false);
    onClose();
    toast.success("Cantique supprime");
  };

  return (
    <Dialog open={!!cantique} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Modifier le cantique {cantique?.numero}
            {cantique ? ` — ${nomLangue(langueDe(cantique))}` : ""}
          </DialogTitle>
          <DialogDescription>
            Réservé au concepteur. La correction sera envoyée à tous les utilisateurs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mod-nom">Nom du cantique</Label>
            <Input id="mod-nom" value={nom} onChange={(e) => setNom(e.target.value)} />
          </div>
          {cantique && langueDe(cantique) !== "fr" ? (
            <div className="space-y-2">
              <Label htmlFor="mod-ref">Référence française</Label>
              <Input
                id="mod-ref"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Ex. 123 — Titre français"
              />
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="mod-texte">Texte</Label>
            <Textarea
              id="mod-texte"
              rows={12}
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="destructive" onClick={supprimer} disabled={envoi}>
            Supprimer
          </Button>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={enregistrer} disabled={envoi}>
            {envoi ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
