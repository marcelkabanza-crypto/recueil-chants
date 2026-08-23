import { Plus } from "lucide-react";
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useCantiques } from "@/lib/cantiques-store";
import { LANGUES, type Langue } from "@/lib/langues";
import { useSettings } from "@/lib/settings";

/**
 * Bouton d'ajout d'un cantique, réservé au concepteur (rôle administrateur).
 * Les autres utilisateurs ne voient rien.
 */
export function NouveauCantique({ langue = "fr" }: { langue?: Langue }) {
  const { isAdmin } = useAuth();
  const { adminUnlocked } = useSettings();
  const { sync } = useCantiques();
  const [open, setOpen] = useState(false);
  const [numero, setNumero] = useState("");
  const [nom, setNom] = useState("");
  const [texte, setTexte] = useState("");
  const [code, setCode] = useState<Langue>(langue);
  const [envoi, setEnvoi] = useState(false);

  if (!isAdmin && !adminUnlocked) return null;

  const enregistrer = async () => {
    const num = Number(numero);
    if (!Number.isInteger(num) || num <= 0) {
      toast.error("Numéro invalide");
      return;
    }
    if (!nom.trim() || !texte.trim()) {
      toast.error("Le nom et le texte sont obligatoires");
      return;
    }
    setEnvoi(true);
    const { error } = await supabase
      .from("cantiques")
      .insert({ numero: num, nom: nom.trim(), texte: texte.trim(), langue: code });

    if (error) {
      setEnvoi(false);
      toast.error("Enregistrement impossible", { description: error.message });
      return;
    }

    // Nouvelle version du recueil : les utilisateurs recevront la mise à jour.
    const { data: v } = await supabase
      .from("recueil_version")
      .select("version")
      .eq("id", 1)
      .maybeSingle();
    await supabase
      .from("recueil_version")
      .update({ version: (v?.version ?? 0) + 1, published_at: new Date().toISOString() })
      .eq("id", 1);

    await sync({ force: true });
    setEnvoi(false);
    setNumero("");
    setNom("");
    setTexte("");
    setOpen(false);
    toast.success("Cantique ajouté");
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="mb-4 h-12 w-full gap-2">
        <Plus className="size-5" />
        Nouveau Cantique
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouveau cantique</DialogTitle>
            <DialogDescription>
              Réservé au concepteur. Le cantique sera envoyé à tous les utilisateurs.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="numero">Numéro</Label>
                <Input
                  id="numero"
                  inputMode="numeric"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Recueil</Label>
                <Select value={code} onValueChange={(v) => setCode(v as Langue)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUES.map((l) => (
                      <SelectItem key={l.code} value={l.code}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nom">Nom du cantique</Label>
              <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="texte">Texte</Label>
              <Textarea
                id="texte"
                rows={10}
                value={texte}
                onChange={(e) => setTexte(e.target.value)}
                placeholder="Couplets et refrains…"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={enregistrer} disabled={envoi}>
              {envoi ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
