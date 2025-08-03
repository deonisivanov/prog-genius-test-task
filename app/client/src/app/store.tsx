"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

import { KeysStore } from "@/features/keypress/store";
import type { KeypressStat } from "@/features/keypress/model";

type StoreSnapshot = { keys?: KeypressStat[] };

class RootStore {
  keysStore: KeysStore;

  constructor(snapshot?: StoreSnapshot) {
    this.keysStore = new KeysStore();
    if (snapshot?.keys) this.keysStore.hydrate(snapshot.keys);
  }
}

const StoreContext = createContext<RootStore | null>(null);

let singleton: RootStore | null = null;

function getOrCreateStore(snapshot?: StoreSnapshot): RootStore {
  if (typeof window === "undefined") {
    return new RootStore(snapshot);
  }

  if (!singleton) {
    singleton = new RootStore(snapshot);
  }

  return singleton;
}

type StoreProviderProps = { children: ReactNode; initialData?: StoreSnapshot };
export function StoreProvider({ children, initialData }: StoreProviderProps) {
  const store = getOrCreateStore(initialData);
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
