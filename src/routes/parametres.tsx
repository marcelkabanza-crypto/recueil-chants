import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, Mail, MessageCircle, Moon, RotateCcw, Sun } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useSettings } from "@/lib/settings";


const WHATSAPP = "243977778889";
const EMAIL = "esperancetabernacle24@gmail.com";

export const Route = createFileRoute("/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres — Recueil des Chants TESP" },
      {
        name: "description",
        content:
          "Réglez la police et la taille du texte des cantiques, ou contactez l'administrateur du Recueil TESP.",
      },
      { property: "og:title", content: "Paramètres — Recueil des Chants TESP" },
      {
        property: "og:description",
        content: "Police, taille du texte et contact de l'administrateur.",
      },
    ],
  }),
  component: Parametres,
});

function Parametres() {
  const {
    fontFamily,
    fontScale,
    theme,
    adminUnlocked,
    setFontFamily,
    setFontScale,
    setTheme,
    unlockAdmin,
    lockAdmin,
    reset,
  } = useSettings();
  const [code, setCode] = useState("");

  const valider = () => {
    if (unlockAdmin(code)) {
      setCode("");
      toast.success("Mode concepteur activé");
    } else {
      toast.error("Id Admin incorrect");
    }
  };


  return (
    <AppShell title="Paramètres" backTo="/">
      <section className="bg-card shadow-soft rounded-lg border p-4">
        <h2 className="font-display text-lg font-semibold">Mode d'affichage</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            variant={theme === "jour" ? "default" : "outline"}
            onClick={() => setTheme("jour")}
          >
            <Sun /> Mode jour
          </Button>
          <Button
            variant={theme === "nuit" ? "default" : "outline"}
            onClick={() => setTheme("nuit")}
          >
            <Moon /> Mode nuit
          </Button>
        </div>
      </section>

      <section className="bg-card shadow-soft mt-4 rounded-lg border p-4">
        <h2 className="font-display text-lg font-semibold">Police du texte</h2>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            variant={fontFamily === "serif" ? "default" : "outline"}
            onClick={() => setFontFamily("serif")}
            className="font-display"
          >
            Classique
          </Button>
          <Button
            variant={fontFamily === "sans" ? "default" : "outline"}
            onClick={() => setFontFamily("sans")}
          >
            Moderne
          </Button>
        </div>

        <div className="mt-6">
          <Label>Taille du texte — {Math.round(fontScale * 100)}%</Label>
          <Slider
            className="mt-3"
            value={[fontScale]}
            min={0.85}
            max={1.8}
            step={0.05}
            onValueChange={([v]) => setFontScale(v ?? 1)}
          />
        </div>

        <div className="bg-muted mt-5 rounded-md p-3">
          <p className="cantique-text">
            {`1. Gloire à l'Agneau qui fut immolé,
Lui seul est digne d'être exalté.`}
          </p>
        </div>

        <Button variant="ghost" size="sm" className="mt-3" onClick={reset}>
          <RotateCcw /> Réinitialiser
        </Button>
      </section>

      <section className="bg-card shadow-soft mt-4 rounded-lg border p-4">
        <h2 className="font-display text-lg font-semibold">Id Admin</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Réservé au concepteur : saisissez votre Id Admin pour activer le bouton
          « Nouveau Cantique ».
        </p>

        {adminUnlocked ? (
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Mode concepteur activé</p>
            <Button variant="outline" size="sm" onClick={lockAdmin}>
              Désactiver
            </Button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <Label htmlFor="id-admin">Id Admin</Label>
            <Input
              id="id-admin"
              type="password"
              autoComplete="off"
              value={code}
              maxLength={64}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") valider();
              }}
              placeholder="Saisir l'Id Admin"
              className="h-12"
            />
            <Button className="w-full gap-2" onClick={valider} disabled={!code.trim()}>
              <KeyRound className="size-4" /> Activer
            </Button>
          </div>
        )}
      </section>

      <section className="bg-card shadow-soft mt-4 rounded-lg border p-4">
        <h2 className="font-display text-lg font-semibold">Contacter l'administrateur</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Pour signaler une erreur ou proposer un nouveau cantique.
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contacter par WhatsApp"
            className="flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition-transform active:scale-95"
          >
            <MessageCircle className="size-7" />
          </a>
          <a
            href={`mailto:${EMAIL}`}
            aria-label="Contacter par Gmail"
            className="flex size-14 items-center justify-center rounded-full bg-[#EA4335] text-white shadow-soft transition-transform active:scale-95"
          >
            <Mail className="size-7" />
          </a>
        </div>
      </section>
    </AppShell>
  );
}
