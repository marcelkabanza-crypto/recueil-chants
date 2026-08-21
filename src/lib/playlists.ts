import { useCallback, useEffect, useState } from "react";

export type Playlist = {
  id: string;
  nom: string;
  numeros: number[];
  createdAt: number;
};

const KEY = "tesp-playlists";

function read(): Playlist[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Playlist[]) : [];
  } catch {
    return [];
  }
}

function write(lists: Playlist[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lists));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event("tesp-playlists-changed"));
}

/** Listes de chants du conducteur, conservées sur l'appareil (hors ligne). */
export function usePlaylists() {
  const [lists, setLists] = useState<Playlist[]>([]);

  useEffect(() => {
    const sync = () => setLists(read());
    sync();
    window.addEventListener("tesp-playlists-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("tesp-playlists-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const createList = useCallback((nom: string) => {
    const list: Playlist = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      nom: nom.trim() || "Nouvelle liste",
      numeros: [],
      createdAt: Date.now(),
    };
    write([...read(), list]);
    return list;
  }, []);

  const renameList = useCallback((id: string, nom: string) => {
    write(read().map((l) => (l.id === id ? { ...l, nom: nom.trim() || l.nom } : l)));
  }, []);

  const deleteList = useCallback((id: string) => {
    write(read().filter((l) => l.id !== id));
  }, []);

  const addChant = useCallback((id: string, numero: number) => {
    write(
      read().map((l) =>
        l.id === id && !l.numeros.includes(numero)
          ? { ...l, numeros: [...l.numeros, numero] }
          : l,
      ),
    );
  }, []);

  const removeChant = useCallback((id: string, numero: number) => {
    write(
      read().map((l) =>
        l.id === id ? { ...l, numeros: l.numeros.filter((n) => n !== numero) } : l,
      ),
    );
  }, []);

  const moveChant = useCallback((id: string, index: number, dir: -1 | 1) => {
    write(
      read().map((l) => {
        if (l.id !== id) return l;
        const target = index + dir;
        if (target < 0 || target >= l.numeros.length) return l;
        const numeros = [...l.numeros];
        const [item] = numeros.splice(index, 1);
        numeros.splice(target, 0, item!);
        return { ...l, numeros };
      }),
    );
  }, []);

  return {
    lists,
    createList,
    renameList,
    deleteList,
    addChant,
    removeChant,
    moveChant,
  };
}
