import { REGISTRY_PLUGIN } from '@/constants';
import { invoke } from '@tauri-apps/api';

type HKeyType = 'ClassesRoot' | 'CurrentUser' | 'LocalMachine' | 'Users' | 'PerformanceData' | 'PerformanceText' | 'PerformanceNLSText' | 'CurrentConfig' | 'DynData' | 'CurrentUserLocalSettings';

interface RegValue {
  success: boolean;
  reason: string;
  value: string;
  valueType: string;
  lastWriteTime: string;
}

interface RegKeys {
  success: boolean;
  reason: string;
  keys: string[];
}

interface RegItem {
  name: string;
  value: string;
  valueType: string;
}

interface RegItems {
  success: boolean;
  reason: string;
  items: RegItem[];
}

export class Registry {
  async getValue(hkey: HKeyType, path: string, name: string) {
    return await invoke<RegValue>(REGISTRY_PLUGIN.GET_REGISTRY_VALUE, { path, name, hkey });
  }

  async getKeys(hkey: HKeyType, path: string) {
    return await invoke<RegKeys>(REGISTRY_PLUGIN.GET_REGISTRY_KEYS, { path, hkey });
  }

  async getValues(hkey: HKeyType, path: string) {
    return await invoke<RegItems>(REGISTRY_PLUGIN.GET_REGISTRY_VALUES, { path, hkey });
  }
}
