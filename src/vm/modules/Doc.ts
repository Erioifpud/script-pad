import { appendDoc, createDoc, readDoc, readDocByLines, updateDocTitle, writeDoc } from '@/utils/doc';

interface WriteOptions {
  mode: 'override' | 'append';
}

export class Doc {
  async read(id: string) {
    return readDoc(id);
  }

  async readByLines(id: string, lines: number) {
    return readDocByLines(id, lines);
  }

  async write(id: string, content: string, options: WriteOptions = { mode: 'override' }) {
    const trimmed = id?.trim()
    const newFlag = !!(trimmed)
    let docId = trimmed
    if (!newFlag) {
      docId = createDoc(content)
      return
    }
    if (options.mode === 'append') {
      appendDoc(id, content)
      return
    }
    writeDoc(id, content)
    return docId
  }

  async updateTitle(id: string, title: string) {
    return updateDocTitle(id, title);
  }
}