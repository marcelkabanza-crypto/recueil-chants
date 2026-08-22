import { Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Cantique } from "@/data/cantiques";

type Props = {
  cantique: Cantique;
  className?: string;
  size?: "default" | "sm" | "icon";
  variant?: "default" | "outline" | "ghost";
};

export function ShareButton({
  cantique,
  className,
  size = "icon",
  variant = "ghost",
}: Props) {
  const handleShare = async () => {
    const text = `${cantique.numero}. ${cantique.nom}\n\n${cantique.texte}\n\nRecueil des chants du Tabernacle de l'espérance Kinshasa-Matete.`;

    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: `Cantique ${cantique.numero} — ${cantique.nom}`,
          text,
        });
      } catch (err) {
        // L'utilisateur a annulé ou le partage a échoué : on ne fait rien.
        if ((err as Error).name !== "AbortError") {
          toast.error("Le partage n'a pas pu s'effectuer.");
        }
      }
      return;
    }

    // Fallback : copier dans le presse-papiers
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Cantique copié dans le presse-papiers.");
    } catch {
      toast.error("Impossible de copier le cantique.");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      aria-label={`Partager le cantique ${cantique.numero}`}
      onClick={() => void handleShare()}
    >
      <Share2 />
    </Button>
  );
}
