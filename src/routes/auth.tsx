import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogIn, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion — Recueil des Chants TESP" },
      {
        name: "description",
        content:
          "Connectez-vous ou créez votre compte pour accéder au Recueil des Chants du Tabernacle de l'Espérance.",
      },
      { property: "og:title", content: "Connexion — Recueil des Chants TESP" },
      {
        property: "og:description",
        content: "Comptes membres et administration du Recueil des Chants TESP.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"connexion" | "inscription">("connexion");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (user) void navigate({ to: "/", replace: true });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    if (mode === "connexion") {
      const { error: err } = await signIn(email, password);
      if (err) setError(err);
    } else {
      const { error: err, needsConfirmation } = await signUp(nom, email, password);
      if (err) setError(err);
      else if (needsConfirmation)
        setInfo("Compte créé. Vérifiez votre boîte e-mail pour confirmer votre adresse.");
    }
    setBusy(false);
  };

  return (
    <AppShell title={mode === "connexion" ? "Connexion" : "Créer un compte"} backTo="/">
      <section className="bg-card shadow-soft rounded-lg border p-5">
        <p className="text-muted-foreground text-sm">
          {mode === "connexion"
            ? "Connectez-vous avec votre adresse e-mail et votre mot de passe."
            : "Créez votre compte membre du Tabernacle de l'Espérance."}
        </p>

        <form onSubmit={submit} className="mt-4 space-y-4">
          {mode === "inscription" ? (
            <div>
              <Label htmlFor="nom">Nom complet</Label>
              <Input
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                autoComplete="name"
                required
                className="mt-1"
              />
            </div>
          ) : null}

          <div>
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "connexion" ? "current-password" : "new-password"}
              required
              minLength={6}
              className="mt-1"
            />
          </div>

          {error ? <p className="text-destructive text-sm">{error}</p> : null}
          {info ? <p className="text-sm text-emerald-700 dark:text-emerald-400">{info}</p> : null}

          <Button type="submit" className="w-full" disabled={busy}>
            {mode === "connexion" ? <LogIn /> : <UserPlus />}
            {mode === "connexion" ? "Se connecter" : "Créer mon compte"}
          </Button>
        </form>

        <Button
          variant="ghost"
          size="sm"
          className="mt-4 w-full"
          onClick={() => {
            setMode(mode === "connexion" ? "inscription" : "connexion");
            setError(null);
            setInfo(null);
          }}
        >
          {mode === "connexion"
            ? "Pas encore de compte ? Créer un compte"
            : "J'ai déjà un compte — Se connecter"}
        </Button>
      </section>
    </AppShell>
  );
}
