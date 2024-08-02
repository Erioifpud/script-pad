import { path } from '@tauri-apps/api';

export class Path {
  async getAppDir() {
    return path.appDataDir();
  }

  async join(...paths: string[]) {
    return path.join(...paths);
  }

  async resolve(...paths: string[]) {
    return path.resolve(...paths);
  }

  async extname(pathStr: string) {
    return path.extname(pathStr);
  }

  async dirname(pathStr: string) {
    return path.dirname(pathStr);
  }

  async delimiter() {
    return path.delimiter;
  }

  async sep() {
    return path.sep;
  }

  async isAbsolute(pathStr: string) {
    return path.isAbsolute(pathStr);
  }
}
