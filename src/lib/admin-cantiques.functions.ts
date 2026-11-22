import { createServerFn } from "@tanstack/react-start";

type Entree = { code: string; numero: number; nom: string; texte: string; langue: string };

/** Ajout d'un cantique par le concepteur (Id Admin vérifié côté serveur). */
export const ajouterCantique = createServerFn({ method: "POST" })
  .inputValidator((d: Entree) => {
    if (typeof d?.code !== "string" || !Number.isInteger(d.numero) || d.numero <= 0)
      throw new Error("Données invalides");
    if (!d.nom?.trim() || !d.texte?.trim()) throw new Error("Nom et texte obligatoires");
    if (!["fr", "ln", "sw", "lu"].includes(d.langue)) throw new Error("Recueil invalide");
    return d;
  })
  .handler(async ({ data }) => {
    if (data.code !== "Vision8889") throw new Error("Id Admin incorrect");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("cantiques").insert({
      numero: data.numero,
      nom: data.nom.trim(),
      texte: data.texte.trim(),
      langue: data.langue,
    });
    if (error) throw new Error(error.message);
    const { data: v } = await supabaseAdmin
      .from("recueil_version").select("version").eq("id", 1).maybeSingle();
    await supabaseAdmin
      .from("recueil_version")
      .update({ version: (v?.version ?? 0) + 1, published_at: new Date().toISOString() })
      .eq("id", 1);
    return { ok: true };
  });
