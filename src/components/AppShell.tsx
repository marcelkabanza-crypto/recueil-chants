import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  CircleHelp,
  Home,
  Info,
  LogOut,
  Menu,
  MoreVertical,
  Settings,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpdateBanner } from "@/components/UpdateBanner";
import { InstallButton } from "@/components/InstallButton";
import { LANGUES, type Langue } from "@/lib/langues";



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
  langueCourante,
}: {
  title: string;
  children: ReactNode;
  backTo?: string | { to: string; params?: Record<string, string> };
  /** Recueil affiché : il est masqué dans le menu de droite. */
  langueCourante?: Langue;
}) {
  const [open, setOpen] = useState(false);
  const [quitOpen, setQuitOpen] = useState(false);
  

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
            {typeof backTo === "string" ? (
              <Link to={backTo} aria-label="Retour">
                <ArrowLeft />
              </Link>
            ) : (
              <Link to={backTo.to} params={backTo.params} aria-label="Retour">
                <ArrowLeft />
              </Link>
            )}
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

              <InstallButton className="mt-3 w-full" />
            </nav>
          </SheetContent>
        </Sheet>
        <h1 className="font-display truncate text-lg font-semibold">{title}</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Autres recueils"
              className="ml-auto text-sidebar-foreground hover:bg-white/10"
            >
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {LANGUES.filter((l) => l.code !== langueCourante).map((l) => (
              <DropdownMenuItem key={l.code} asChild>
                <Link to="/recueil/$langue" params={{ langue: l.code }}>
                  {l.menu}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
