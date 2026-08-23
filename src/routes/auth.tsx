import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Espace concepteur — Recueil des Chants TESP" },
      {
        name: "description",
        content: "Accès réservé au concepteur du recueil des chants du Tabernacle de l'Espérance.",
      },
      { property: "og:title", content: "Espace concepteur — Recueil des Chants TESP" },
      {
        property: "og:description",
        content: "Connexion réservée au concepteur de l'application.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { signIn, signOut, email, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [courriel, setCourriel] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [envoi, setEnvoi] = useState(false);

  const connecter = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnvoi(true);
    const { error } = await signIn(courriel.trim(), motDePasse);
    setEnvoi(false);
    if (error) {
      toast.error("Connexion impossible", { description: error });
      return;
    }
    toast.success("Connexion réussie");
    void navigate({ to: "/" });
  };

  return (
    <AppShell title="Espace concepteur" backTo="/">
      {email ? (
        <div className="space-y-4">
          <p className="text-sm">
            Connecté en tant que <strong>{email}</strong>
            {isAdmin ? " (concepteur)" : " (utilisateur simple)"}.
          </p>
          <Button
            variant="outline"
            onClick={async () => {
              await signOut();
              toast.success("Déconnecté");
            }}
          >
            Se déconnecter
          </Button>
        </div>
      ) : (
        <form onSubmit={connecter} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="courriel">Adresse e-mail</Label>
            <Input
              id="courriel"
              type="email"
              autoComplete="email"
              required
              value={courriel}
              onChange={(e) => setCourriel(e.target.value)}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mdp">Mot de passe</Label>
            <Input
              id="mdp"
              type="password"
              autoComplete="current-password"
              required
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="h-12"
            />
          </div>
          <Button type="submit" className="h-12 w-full" disabled={envoi}>
            {envoi ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
      )}
    </AppShell>
  );
}
