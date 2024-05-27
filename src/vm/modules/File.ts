import { dialog, fs, path as tauriPath } from '@tauri-apps/api';

export class FileManager {
  static _read(options: dialog.OpenDialogOptions) {
    return dialog.open(options);
  }
  static async readFiles(options: Omit<dialog.OpenDialogOptions, 'directory' | 'defaultPath' | 'recursive' | 'multiple'>) {
    return FileManager._read({
      ...options,
      multiple: true,
      directory: false,
      recursive: false,
    })
  }

  static async readDirs(options: Omit<dialog.OpenDialogOptions, 'directory' | 'defaultPath' | 'multiple'>) {
    return FileManager._read({
      ...options,
      multiple: true,
      directory: true,
    })
  }

  static async readAsString(path: string) {
    return fs.readTextFile(path);
  }

  static async readAsBuffer(path: string) {
    return fs.readBinaryFile(path, {});
  }

  static async writeAsString(path: string, content: string, append = false) {
    return fs.writeTextFile(path, content, {
      append
    });
  }

  static async writeAsBuffer(path: string, content: Uint8Array, append = false) {
    return fs.writeBinaryFile(path, content, {
      append
    });
  }

  static async deleteFile(path: string) {
    const flag = await dialog.confirm(`确定删除 ${path} 文件?`)
    if (!flag) {
      return;
    }
    return fs.removeFile(path);
  }

  static async deleteDir(path: string) {
    const flag = await dialog.confirm(`确定删除 ${path} 目录?`)
    if (!flag) {
      return;
    }
    return fs.removeDir(path);
  }

  static async moveFile(path: string, newPath: string) {
    if (await FileManager.exists(newPath)) {
      throw new Error('File already exists');
    }
    return fs.renameFile(path, newPath);
  }

  static async renameFile(path: string, newName: string) {
    const segs = path.split(tauriPath.sep)
    const pathList = segs.slice(0, segs.length - 1)
    const newPath = [...pathList, newName].join('/')
    if (await FileManager.exists(newPath)) {
      throw new Error('File already exists');
    }
    return fs.renameFile(path, newPath);
  }

  static async exists(path: string) {
    return fs.exists(path);
  }
}