import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useCantiques } from "@/lib/cantiques-store";

/** Notification visuelle affichée lorsqu'une mise à jour des chants est disponible. */
export function UpdateBanner() {
  const { updateAvailable, downloading, applyUpdate } = useCantiques();

  if (!updateAvailable) return null;

  const install = async () => {
    const { ok, error } = await applyUpdate();
    if (ok) toast.success("Mise à jour des chants installée. Disponible hors ligne.");
    else toast.error(error ?? "Échec de la mise à jour.");
  };

  return (
    <button
      type="button"
      onClick={() => void install()}
      disabled={downloading}
      className="bg-accent text-accent-foreground flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium"
    >
      {downloading ? (
        <Loader2 className="size-4 shrink-0 animate-spin" />
      ) : (
        <Download className="size-4 shrink-0" />
      )}
      <span>
        Une mise à jour des chants est disponible. Cliquez ici pour la télécharger
        {updateAvailable.count > 0 ? ` (${updateAvailable.count} nouveau${updateAvailable.count > 1 ? "x" : ""})` : ""}.
      </span>
    </button>
  );
}
