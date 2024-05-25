import { BaseDirectory, readTextFile, removeFile, writeFile } from '@tauri-apps/api/fs';
import { StateStorage } from 'zustand/middleware';

const CONFIG_DIR = BaseDirectory.AppConfig
const APP_CONFIG_FILE = 'script-pad-app.json';

// Tauri Storage
export const storage: StateStorage = ({
  getItem: async (name: string): Promise<string | null> => {
    return null
  },
  setItem: async (name: string, value: string): Promise<void> => {

  },
  removeItem: async (name: string): Promise<void> => {

  },
})