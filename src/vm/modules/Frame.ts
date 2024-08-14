import { WINDOW_PLUGIN } from '@/constants';
import { randomUUID } from '@/store/utils';
import { invoke } from '@tauri-apps/api';

interface WindowOptions {
  label: string;
  url: string;
  userAgent?: string;
  fileDropEnabled?: boolean;
  center?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  resizable?: boolean;
  maximizable?: boolean;
  minimizable?: boolean;
  closable?: boolean;
  title?: string;
  fullscreen?: boolean;
  focused?: boolean;
  transparent?: boolean;
  maximized?: boolean;
  visible?: boolean;
  decorations?: boolean;
  alwaysOnTop?: boolean;
  contentProtected?: boolean;
  skipTaskbar?: boolean;
  theme?: 'Light' | 'Dark';
  titleBarStyle?: 'Visible' | 'Transparent' | 'Overlay';
  hiddenTitle?: boolean;
  acceptFirstMouse?: boolean;
  tabbingIdentifier?: string;
  additionalBroswerArgs?: string;
}

export class Frame {
  async createWindow(options: WindowOptions, reusable = false) {
    if (!options.label) {
      options.label = randomUUID();
    }
    await invoke(WINDOW_PLUGIN.CREATE_WINDOW, { options, reusable })
    return options.label;
  }

  async closeWindow(label: string) {
    return invoke(WINDOW_PLUGIN.CLOSE_WINDOW, {
      label,
    })
  }
}