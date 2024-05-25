import { StateStorage } from 'zustand/middleware';
import { Store } from "tauri-plugin-store-api";

// Tauri Storage
const getStore: (store: Store) => StateStorage = (store) => ({
  getItem: async (name: string): Promise<string | null> => {
    console.log('[PLUGIN-STORE]', 'READ:', name)
    return (await store.get(name)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    console.log('[PLUGIN-STORE]', 'WRITE:', name, value)
    await store.set(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    console.log('[PLUGIN-STORE]', 'DELETE:', name)
    await store.delete(name)
  },
})

export const appStorage = getStore(new Store('.script-pad-app.dat'))