import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type FontFamily = "serif" | "sans";
export type ThemeMode = "jour" | "nuit";

type Settings = {
  fontFamily: FontFamily;
  fontScale: number;
  theme: ThemeMode;
  /** Mode concepteur activé localement via l'Id Admin. */
  adminUnlocked: boolean;
};

const DEFAULTS: Settings = {
  fontFamily: "serif",
  fontScale: 1,
  theme: "jour",
  adminUnlocked: false,
};
const KEY = "tesp-settings";
const ADMIN_CODE = "Vision8889";

type SettingsContextValue = Settings & {
  setFontFamily: (v: FontFamily) => void;
  setFontScale: (v: number) => void;
  setTheme: (v: ThemeMode) => void;
  /** Retourne vrai si l'Id Admin est correct. */
  unlockAdmin: (code: string) => boolean;
  lockAdmin: () => void;
  reset: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--reading-font",
      settings.fontFamily === "serif"
        ? "var(--font-display)"
        : "var(--font-body)",
    );
    root.style.setProperty("--reading-scale", String(settings.fontScale));
    root.classList.toggle("dark", settings.theme === "nuit");
    root.style.colorScheme = settings.theme === "nuit" ? "dark" : "light";
  }, [settings]);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setFontFamily: (fontFamily) => update({ fontFamily }),
        setFontScale: (fontScale) => update({ fontScale }),
        setTheme: (theme) => update({ theme }),
        unlockAdmin: (code) => {
          const ok = code.trim() === ADMIN_CODE;
          if (ok) update({ adminUnlocked: true });
          return ok;
        },
        lockAdmin: () => update({ adminUnlocked: false }),
        reset: () => update({ ...DEFAULTS, adminUnlocked: settings.adminUnlocked }),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
