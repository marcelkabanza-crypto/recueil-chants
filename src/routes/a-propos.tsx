import { createFileRoute } from "@tanstack/react-router";
import { Copy, Share2, Youtube } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useCantiques } from "@/lib/cantiques-store";
import { APP_VERSION } from "@/lib/app-version";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — Recueil des Chants TESP" },
      {
        name: "description",
        content:
          "Le Recueil des Chants TESP rassemble les cantiques du Tabernacle de l'Espérance pour l'assemblée et les conducteurs de chants.",
      },
      { property: "og:title", content: "À propos — Recueil des Chants TESP" },
      {
        property: "og:description",
        content: "L'application des cantiques du Tabernacle de l'Espérance.",
      },
    ],
  }),
  component: APropos,
});

function APropos() {
  const { cantiques, version } = useCantiques();

  const lien = typeof window === "undefined" ? "" : window.location.origin;
  const message = `Recueil des Chants TESP — les cantiques du Tabernacle de l'Espérance. Installez l'application : ${lien}`;

  const partager = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Recueil des Chants TESP",
          text: "Les cantiques du Tabernacle de l'Espérance",
          url: lien,
        });
        return;
      } catch {
        return; // partage annulé
      }
    }
    await copier();
  };

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(message);
      toast.success("Lien copié : partagez-le par WhatsApp ou SMS.");
    } catch {
      toast.error("Copie impossible. Lien : " + lien);
    }
  };

  return (
    <AppShell title="À propos" backTo="/">
      <section className="bg-card shadow-soft rounded-lg border p-5 text-center">
        <p className="font-display text-2xl font-semibold">Recueil des Chants TESP</p>
        <p className="text-muted-foreground mt-1 text-sm">Tabernacle de l'Espérance</p>
        <p className="text-muted-foreground mt-4 text-xs">
          Version {APP_VERSION}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          {cantiques.length} cantiques — recueil version {version}
        </p>
      </section>

      <section className="bg-card shadow-soft mt-4 rounded-lg border p-4">
        <h2 className="font-display text-lg font-semibold">Notre mission</h2>
        <p className="mt-1 text-sm leading-relaxed">
          Cette application met les cantiques du Tabernacle de l'Espérance à la portée de chaque
          membre : numéro, nom et texte complet, disponibles à tout moment pendant le culte, la
          prière ou la méditation personnelle. Les nouveaux cantiques ajoutés par
          l'administrateur arrivent automatiquement dès que votre téléphone est connecté à
          Internet.
        </p>
      </section>

      <section className="bg-card shadow-soft mt-4 rounded-lg border p-4">
        <h2 className="font-display text-lg font-semibold">Concepteur</h2>
        <p className="mt-1 text-sm leading-relaxed">
          <span className="font-semibold">Vision Informatique</span> est le concepteur de cette
          application. Entreprise informatique, elle propose des solutions digitales : conception
          d'applications web et mobiles, sites internet, gestion de bases de données et
          accompagnement numérique des organisations.
        </p>
      </section>

      <section className="bg-card shadow-soft mt-4 rounded-lg border p-4">
        <h2 className="font-display text-lg font-semibold">Partager l'application</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Envoyez le recueil à d'autres téléphones : WhatsApp, SMS, e-mail ou tout autre moyen.
        </p>
        <div className="mt-4 space-y-2">
          <Button className="w-full" onClick={() => void partager()}>
            <Share2 /> Partager l'application
          </Button>
          <Button variant="outline" className="w-full" onClick={() => void copier()}>
            <Copy /> Copier le lien
          </Button>
        </div>
      </section>

      <Button asChild variant="outline" className="mt-4 w-full">
        <a
          href="https://www.youtube.com/@TabEsperance"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Youtube /> Notre chaîne YouTube
        </a>
      </Button>
    </AppShell>
  );
}
