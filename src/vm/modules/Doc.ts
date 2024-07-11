import { appendDoc, createDoc, readDoc, readDocByLines, updateDocTitle, writeDoc } from '@/utils/doc';

interface WriteOptions {
  mode: 'override' | 'append';
}

export class Doc {
  static async read(id: string) {
    return readDoc(id);
  }

  static async readByLines(id: string, lines: number) {
    return readDocByLines(id, lines);
  }

  static async write(id: string, content: string, options: WriteOptions = { mode: 'override' }) {
    const trimmed = id?.trim()
    const newFlag = !!(trimmed)
    if (!newFlag) {
      createDoc(content)
      return
    }
    if (options.mode === 'append') {
      appendDoc(id, content)
      return
    }
    writeDoc(id, content)
  }

  static async updateTitle(id: string, title: string) {
    return updateDocTitle(id, title);
  }
}