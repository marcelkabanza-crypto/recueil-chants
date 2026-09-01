import { createFileRoute } from "@tanstack/react-router";
import recueil from "../../../../public/cantiques.json";

const TOKEN = "tsh-reimport-7f3c9d21";

export const Route = createFileRoute("/api/public/reimport-tshiluba")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (request.headers.get("x-import-token") !== TOKEN) {
          return new Response("Unauthorized", { status: 401 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const rows = (recueil.cantiques as Array<Record<string, unknown>>)
          .filter((c) => c["langue"] === "lu" && (c["numero"] as number) <= 200)
          .map((c) => ({
            numero: c["numero"] as number,
            nom: c["nom"] as string,
            texte: c["texte"] as string,
            langue: "lu",
            reference: null,
          }));

        const del = await supabaseAdmin
          .from("cantiques")
          .delete()
          .eq("langue", "lu")
          .lte("numero", 200);
        if (del.error) return new Response(del.error.message, { status: 500 });

        for (let i = 0; i < rows.length; i += 50) {
          const { error } = await supabaseAdmin.from("cantiques").insert(rows.slice(i, i + 50));
          if (error) return new Response(error.message, { status: 500 });
        }

        await supabaseAdmin
          .from("recueil_version")
          .update({ version: recueil.version, published_at: new Date().toISOString() })
          .eq("id", 1);

        return Response.json({ inserted: rows.length, version: recueil.version });
      },
    },
  },
});
