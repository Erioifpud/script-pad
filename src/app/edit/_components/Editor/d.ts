export const dts = `
/**
 * Extension filters for the file dialog.
 *
 * @since 1.0.0
 */
interface DialogFilter {
    /** Filter name. */
    name: string;
    /**
     * Extensions to filter, without a \`.\` prefix.
     * @example
     * \`\`\`typescript
     * extensions: ['svg', 'png']
     * \`\`\`
     */
    extensions: string[];
}

interface OpenDialogOptions {
  /** The title of the dialog window. */
  title?: string;
  /** The filters of the dialog. */
  filters?: DialogFilter[];
  /** Initial directory or file path. */
  defaultPath?: string;
  /** Whether the dialog allows multiple selection or not. */
  multiple?: boolean;
  /** Whether the dialog is a directory selection or not. */
  directory?: boolean;
  /**
   * If \`directory\` is true, indicates that it will be read recursively later.
   * Defines whether subdirectories will be allowed on the scope or not.
   */
  recursive?: boolean;
}

class FileManager {
  static _read(options: OpenDialogOptions): Promise<string[]>;
  static readFiles(options: Omit<OpenDialogOptions, 'directory' | 'defaultPath' | 'recursive' | 'multiple'>): Promise<string[]>;
  static readDirs(options: Omit<OpenDialogOptions, 'directory' | 'defaultPath' | 'multiple'>): Promise<string[]>;
  static readAsString(path: string): Promise<string>;
  static readAsBuffer(path: string): Promise<Uint8Array>;
  static writeAsString(path: string, content: string, append?: boolean): Promise<void>;
  static writeAsBuffer(path: string, content: Uint8Array, append?: boolean): Promise<void>;
  static deleteFile(path: string): Promise<void>;
  static renameFile(path: string, newName: string): Promise<void>;
  static deleteDir(path: string): Promise<void>;
  static moveFile(path: string, newPath: string): Promise<void>;
  static exists(path: string): Promise<boolean>;
}

declare global {
  interface Window {
    FileManager: FileManager;
  }
}
`