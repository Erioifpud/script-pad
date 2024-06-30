import { StateStorage } from 'zustand/middleware';
import { Store } from "tauri-plugin-store-api";

// Tauri Storage
const getStore: (store: Store) => StateStorage = (store) => ({
  getItem: async (name: string): Promise<string | null> => {
    console.log('[PLUGIN-STORE]', 'READ:', name)
    return (await store.get(name)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    console.log('[PLUGIN-STORE]', 'WRITE:', name)
    await store.set(name, value)
    await store.save()
  },
  removeItem: async (name: string): Promise<void> => {
    console.log('[PLUGIN-STORE]', 'DELETE:', name)
    await store.delete(name)
  },
})

export const appStorage = getStore(new Store('.script-pad-app.dat'))
export const docStorage = getStore(new Store('.script-pad-doc.dat'))
export const lowCodeStorage = getStore(new Store('.script-pad-lowcode.dat'))