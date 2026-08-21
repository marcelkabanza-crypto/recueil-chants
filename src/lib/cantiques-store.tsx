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
import { cantiques as bundled, type Cantique } from "@/data/cantiques";

const CACHE_KEY = "tesp-cantiques-cache";

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
  syncing: boolean;
  /** Télécharge la dernière version du recueil (si une connexion est disponible). */
  sync: (options?: { force?: boolean }) => Promise<{ updated: boolean; error: string | null }>;
};

const CantiquesContext = createContext<CantiquesContextValue | null>(null);

function readCache(): CacheShape | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheShape;
    if (!Array.isArray(parsed.cantiques)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function CantiquesProvider({ children }: { children: ReactNode }) {
  const [cache, setCache] = useState<CacheShape>({
    version: 0,
    updatedAt: "",
    cantiques: bundled,
  });
  const [syncing, setSyncing] = useState(false);
  const busy = useRef(false);

  const sync = useCallback(async (options?: { force?: boolean }) => {
    if (busy.current) return { updated: false, error: null };
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      return { updated: false, error: "Aucune connexion Internet." };
    }
    busy.current = true;
    setSyncing(true);
    try {
      const { data: versionRow, error: versionError } = await supabase
        .from("recueil_version")
        .select("version, published_at")
        .eq("id", 1)
        .maybeSingle();
      if (versionError) return { updated: false, error: versionError.message };

      const remoteVersion = versionRow?.version ?? 0;
      const current = readCache();
      if (!options?.force && current && current.version >= remoteVersion) {
        return { updated: false, error: null };
      }

      const { data, error } = await supabase
        .from("cantiques")
        .select("numero, nom, texte")
        .order("numero", { ascending: true });
      if (error) return { updated: false, error: error.message };

      const next: CacheShape = {
        version: remoteVersion,
        updatedAt: versionRow?.published_at ?? new Date().toISOString(),
        cantiques: (data ?? []) as Cantique[],
      };
      if (next.cantiques.length === 0) return { updated: false, error: null };

      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(next));
      } catch {
        /* stockage plein : on garde la version en mémoire */
      }
      const changed = !current || current.version !== next.version;
      setCache(next);
      return { updated: changed, error: null };
    } finally {
      busy.current = false;
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    const cached = readCache();
    if (cached) setCache(cached);
    void sync();

    const onOnline = () => void sync();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [sync]);

  const value = useMemo<CantiquesContextValue>(
    () => ({
      cantiques: cache.cantiques,
      getCantique: (numero: number) => cache.cantiques.find((c) => c.numero === numero),
      version: cache.version,
      updatedAt: cache.updatedAt || null,
      syncing,
      sync,
    }),
    [cache, syncing, sync],
  );

  return <CantiquesContext.Provider value={value}>{children}</CantiquesContext.Provider>;
}

export function useCantiques() {
  const ctx = useContext(CantiquesContext);
  if (!ctx) throw new Error("useCantiques must be used within CantiquesProvider");
  return ctx;
}
