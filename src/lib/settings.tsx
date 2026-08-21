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
};

const DEFAULTS: Settings = { fontFamily: "serif", fontScale: 1, theme: "jour" };
const KEY = "tesp-settings";

type SettingsContextValue = Settings & {
  setFontFamily: (v: FontFamily) => void;
  setFontScale: (v: number) => void;
  setTheme: (v: ThemeMode) => void;
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
        reset: () => update(DEFAULTS),
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
