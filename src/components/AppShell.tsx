import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  CircleHelp,
  Home,
  Info,
  LogIn,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  UserRound,
  Youtube,
  ArrowLeft,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UpdateBanner } from "@/components/UpdateBanner";
import { InstallButton } from "@/components/InstallButton";
import { useAuth } from "@/lib/auth";


const navItems = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/aide", label: "Aide", icon: CircleHelp },
  { to: "/parametres", label: "Paramètres", icon: Settings },
  { to: "/livre-du-conducteur", label: "Livre du conducteur", icon: BookOpen },
  { to: "/a-propos", label: "À propos", icon: Info },
] as const;

const linkClass =
  "flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors hover:bg-sidebar-accent";

export function AppShell({
  title,
  children,
  backTo,
}: {
  title: string;
  children: ReactNode;
  backTo?: string;
}) {
  const [open, setOpen] = useState(false);
  const [quitOpen, setQuitOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  const quit = () => {
    window.close();
    setQuitOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="hero-gradient sticky top-0 z-40 flex items-center gap-2 px-2 py-3 text-sidebar-foreground shadow-soft">
        {backTo ? (
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground hover:bg-white/10"
          >
            <Link to={backTo} aria-label="Retour">
              <ArrowLeft />
            </Link>
          </Button>
        ) : null}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Ouvrir le menu"
              className="text-sidebar-foreground hover:bg-white/10"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[17rem] overflow-y-auto bg-sidebar p-0 text-sidebar-foreground">
            <div className="hero-gradient px-5 py-6">
              <p className="font-display text-lg leading-tight">Recueil des chants</p>
              <p className="text-gold font-display text-2xl font-semibold">TESP</p>
              <p className="mt-1 text-xs opacity-80">Tabernacle de l'Espérance</p>
              {user ? (
                <p className="mt-2 truncate text-xs opacity-80">
                  {isAdmin ? "Administrateur" : "Membre"} · {user.email}
                </p>
              ) : null}
            </div>
            <nav className="flex flex-col gap-1 p-3">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "bg-sidebar-accent text-gold" }}
                  className={linkClass}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}

              {isAdmin ? (
                <Link
                  to="/administration"
                  onClick={() => setOpen(false)}
                  activeProps={{ className: "bg-sidebar-accent text-gold" }}
                  className={linkClass}
                >
                  <ShieldCheck className="size-4" />
                  Administration
                </Link>
              ) : null}

              <a
                href="https://www.youtube.com/@TabEsperance"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                <Youtube className="size-4" />
                Notre chaîne YouTube
              </a>

              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    void signOut();
                  }}
                  className={`${linkClass} text-left`}
                >
                  <UserRound className="size-4" />
                  Se déconnecter
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  activeProps={{ className: "bg-sidebar-accent text-gold" }}
                  className={linkClass}
                >
                  <LogIn className="size-4" />
                  Connexion
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setQuitOpen(true);
                }}
                className={`${linkClass} text-left`}
              >
                <LogOut className="size-4" />
                Quitter
              </button>
            </nav>
          </SheetContent>
        </Sheet>
        <h1 className="font-display truncate text-lg font-semibold">{title}</h1>
      </header>

      <UpdateBanner />

      <main className="mx-auto w-full max-w-2xl px-4 py-5">{children}</main>


      <AlertDialog open={quitOpen} onOpenChange={setQuitOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Quitter l'application ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous pouvez aussi fermer l'application depuis votre téléphone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={quit}>Quitter</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
