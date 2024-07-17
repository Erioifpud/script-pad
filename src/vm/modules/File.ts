import { dialog, fs, path as tauriPath } from '@tauri-apps/api';

export class FileManager {
  _read(options: dialog.OpenDialogOptions) {
    return dialog.open(options);
  }
  async readFiles(options: Omit<dialog.OpenDialogOptions, 'directory' | 'defaultPath' | 'recursive' | 'multiple'>) {
    return this._read({
      ...options,
      multiple: true,
      directory: false,
      recursive: false,
    })
  }

  async readDirs(options: Omit<dialog.OpenDialogOptions, 'directory' | 'defaultPath' | 'multiple'>) {
    return this._read({
      ...options,
      multiple: true,
      directory: true,
    })
  }

  async readAsString(path: string) {
    return fs.readTextFile(path);
  }

  async readAsBuffer(path: string) {
    return fs.readBinaryFile(path, {});
  }

  async readAsBase64(path: string) {
    const buffer = await this.readAsBuffer(path);
    const fr = new FileReader();
    fr.readAsDataURL(new Blob([buffer]));
    return new Promise((resolve, reject) => {
      fr.onload = () => {
        const base64 = fr.result?.toString() || ''
        const [, base64Data] = base64.split(';base64,');
        resolve(base64Data);
      }
      fr.onerror = (err) => {
        reject(err);
      }
    })
  }

  async writeAsString(path: string, content: string, append = false) {
    return fs.writeTextFile(path, content, {
      append
    });
  }

  async writeAsBuffer(path: string, content: Uint8Array, append = false) {
    return fs.writeBinaryFile(path, content, {
      append
    });
  }

  async deleteFile(path: string) {
    const flag = await dialog.confirm(`确定删除 ${path} 文件?`)
    if (!flag) {
      return;
    }
    return fs.removeFile(path);
  }

  async deleteDir(path: string) {
    const flag = await dialog.confirm(`确定删除 ${path} 目录?`)
    if (!flag) {
      return;
    }
    return fs.removeDir(path);
  }

  async moveFile(path: string, newPath: string) {
    if (await this.exists(newPath)) {
      throw new Error('File already exists');
    }
    return fs.renameFile(path, newPath);
  }

  async renameFile(path: string, newName: string) {
    const segs = path.split(tauriPath.sep)
    const pathList = segs.slice(0, segs.length - 1)
    const newPath = [...pathList, newName].join('/')
    if (await this.exists(newPath)) {
      throw new Error('File already exists');
    }
    return fs.renameFile(path, newPath);
  }

  async exists(path: string) {
    return fs.exists(path);
  }
}