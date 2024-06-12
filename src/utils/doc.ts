import { useDocStore } from '@/store/doc';

/**
 * 创建笔记本
 * @param content 笔记本内容
 * @param title 笔记本标题
 */
export function createDoc(content: string, title: string = "文档") {
  const state = useDocStore.getState()
  state.createDoc(content, title)
}

/**
 * 覆写笔记本内容
 * @param id 笔记本 id
 * @param content 笔记本内容
 */
export function writeDoc(id: string, content: string) {
  const state = useDocStore.getState()
  state.editDoc(id, {
    content
  })
}

/**
 * 附加笔记本内容
 * @param id 笔记本 id
 * @param content 笔记本内容
 * @returns
 */
export function appendDoc(id: string, content: string) {
  const state = useDocStore.getState()
  const docs = state.docs
  const doc = docs.find(doc => doc.id === id)
  if (!doc) {
    return
  }
  state.editDoc(id, {
    content: doc.content + content
  })
}

/**
 * 读取笔记本内容
 * @param id 笔记本 id
 * @returns
 */
export function readDoc(id: string) {
  const state = useDocStore.getState()
  const docs = state.docs
  const doc = docs.find(doc => doc.id === id)
  if (!doc) {
    return ""
  }
  return doc.content
}

/**
 * 按 lines 行读取笔记本内容
 * @param id 笔记本 id
 * @param lines 分组行数
 * @returns
 */
export function readDocByLines(id: string, lines: number = 1) {
  lines = Math.floor(lines);
  if (lines <= 1) {
    return []
  }
  const state = useDocStore.getState()
  const docs = state.docs
  const doc = docs.find(doc => doc.id === id)
  if (!doc) {
    return []
  }
  return doc.content.split('\n').reduce<string[][]>((list, next, index) => {
    const i = Math.floor(index / lines)
    if (!list[i]) {
        list[i] = []
    }
    list[i].push(next)
    return list
  }, [])
}

/**
 * 获取笔记本列表
 * @returns docs 列表
 */
export function getDocs() {
  const state = useDocStore.getState()
  return state.docs
}