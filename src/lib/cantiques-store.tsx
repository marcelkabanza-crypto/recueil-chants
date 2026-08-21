import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "@/integrations/supabase/client";
import { recueilLocal, type Cantique } from "@/data/cantiques";

const CACHE_KEY = "tesp-cantiques-cache";

/** Fichier JSON de mise à jour hébergé sur GitHub (raw). */
export const UPDATE_URL: string =
  (import.meta.env["VITE_CANTIQUES_UPDATE_URL"] as string | undefined) ??
  "https://raw.githubusercontent.com/TabEsperance/recueil-chants-tesp/main/cantiques.json";

type CacheShape = {
  version: number;
  updatedAt: string;
  cantiques: Cantique[];
};

type CantiquesContextValue = {
  cantiques: Cantique[];
  getCantique: (numero: number) => Cantique | undefined;
  version: number;
  updatedAt: string | null;
  /** Une mise à jour a été détectée en ligne (non encore installée). */
  updateAvailable: null | { version: number; count: number };
  checking: boolean;
  downloading: boolean;
  /** Vérifie en arrière-plan si un nouveau recueil est disponible en ligne. */
  checkForUpdate: () => Promise<void>;
  /** Installe la mise à jour détectée (enregistrement local). */
  applyUpdate: () => Promise<{ ok: boolean; error: string | null }>;
  syncing: boolean;
  /** Rechargement depuis la base administrateur (usage admin). */
  sync: (options?: { force?: boolean }) => Promise<{ updated: boolean; error: string | null }>;
};

const CantiquesContext = createContext<CantiquesContextValue | null>(null);

function isCantique(value: unknown): value is Cantique {
  const c = value as Cantique | null;
  return (
    !!c && typeof c.numero === "number" && typeof c.nom === "string" && typeof c.texte === "string"
  );
}

function readCache(): CacheShape | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheShape;
    if (!Array.isArray(parsed.cantiques) || !parsed.cantiques.every(isCantique)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(next: CacheShape) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(next));
  } catch {
    /* stockage plein : on garde la version en mémoire */
  }
}

/** Fusionne les chants locaux avec ceux d'une mise à jour (le distant gagne). */
function merge(base: Cantique[], updates: Cantique[]): Cantique[] {
  const map = new Map<number, Cantique>();
  for (const c of base) map.set(c.numero, c);
  for (const c of updates) map.set(c.numero, c);
  return [...map.values()].sort((a, b) => a.numero - b.numero);
}

const baseCache: CacheShape = {
  version: recueilLocal.version,
  updatedAt: recueilLocal.updatedAt,
  cantiques: recueilLocal.cantiques,
};

export function CantiquesProvider({ children }: { children: ReactNode }) {
  // Affichage instantané : les chants embarqués sont disponibles dès le 1er rendu.
  const [cache, setCache] = useState<CacheShape>(baseCache);
  const [updateAvailable, setUpdateAvailable] = useState<CantiquesContextValue["updateAvailable"]>(
    null,
  );
  const [checking, setChecking] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const pending = useRef<CacheShape | null>(null);
  const busy = useRef(false);

  const checkForUpdate = useCallback(async () => {
    if (busy.current) return;
    if (typeof navigator !== "undefined" && navigator.onLine === false) return;
    busy.current = true;
    setChecking(true);
    try {
      const res = await fetch(`${UPDATE_URL}?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) return;
      const remote = (await res.json()) as Partial<CacheShape>;
      if (typeof remote.version !== "number" || !Array.isArray(remote.cantiques)) return;
      const cantiquesDistants = remote.cantiques.filter(isCantique);
      if (cantiquesDistants.length === 0) return;

      const current = readCache() ?? baseCache;
      if (remote.version <= current.version) return;

      const next: CacheShape = {
        version: remote.version,
        updatedAt: remote.updatedAt ?? new Date().toISOString(),
        cantiques: merge(current.cantiques, cantiquesDistants),
      };
      pending.current = next;
      setUpdateAvailable({
        version: next.version,
        count: next.cantiques.length - current.cantiques.length,
      });
    } catch {
      /* hors ligne ou fichier indisponible : on reste sur la version locale */
    } finally {
      busy.current = false;
      setChecking(false);
    }
  }, []);

  const applyUpdate = useCallback(async () => {
    const next = pending.current;
    if (!next) return { ok: false, error: "Aucune mise à jour à installer." };
    setDownloading(true);
    try {
      writeCache(next);
      setCache(next);
      pending.current = null;
      setUpdateAvailable(null);
      return { ok: true, error: null };
    } finally {
      setDownloading(false);
    }
  }, []);

  const sync = useCallback(async (options?: { force?: boolean }) => {
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      return { updated: false, error: "Aucune connexion Internet." };
    }
    setSyncing(true);
    try {
      const { data: versionRow, error: versionError } = await supabase
        .from("recueil_version")
        .select("version, published_at")
        .eq("id", 1)
        .maybeSingle();
      if (versionError) return { updated: false, error: versionError.message };

      const remoteVersion = versionRow?.version ?? 0;
      const current = readCache() ?? baseCache;
      if (!options?.force && current.version >= remoteVersion) {
        return { updated: false, error: null };
      }

      const { data, error } = await supabase
        .from("cantiques")
        .select("numero, nom, texte")
        .order("numero", { ascending: true });
      if (error) return { updated: false, error: error.message };

      const distants = ((data ?? []) as Cantique[]).filter(isCantique);
      if (distants.length === 0) return { updated: false, error: null };

      const next: CacheShape = {
        version: Math.max(remoteVersion, current.version),
        updatedAt: versionRow?.published_at ?? new Date().toISOString(),
        cantiques: distants,
      };
      writeCache(next);
      setCache(next);
      return { updated: true, error: null };
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    const cached = readCache();
    if (cached && cached.version >= baseCache.version) setCache(cached);
    // Vérification en arrière-plan (n'empêche jamais l'affichage hors ligne).
    void checkForUpdate();

    const onOnline = () => void checkForUpdate();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [checkForUpdate]);

  const value = useMemo<CantiquesContextValue>(
    () => ({
      cantiques: cache.cantiques,
      getCantique: (numero: number) => cache.cantiques.find((c) => c.numero === numero),
      version: cache.version,
      updatedAt: cache.updatedAt || null,
      updateAvailable,
      checking,
      downloading,
      checkForUpdate,
      applyUpdate,
      syncing,
      sync,
    }),
    [cache, updateAvailable, checking, downloading, checkForUpdate, applyUpdate, syncing, sync],
  );

  return <CantiquesContext.Provider value={value}>{children}</CantiquesContext.Provider>;
}

export function useCantiques() {
  const ctx = useContext(CantiquesContext);
  if (!ctx) throw new Error("useCantiques must be used within CantiquesProvider");
  return ctx;
}
