import { create } from 'zustand'
import { randomUUID } from './utils'
import { createJSONStorage, persist } from 'zustand/middleware'
import { docStorage } from './utils/storage'
import { merge as deepMerge } from 'lodash-es'
// import { createDebouncedJSONStorage } from 'zustand-debounce'
import { produce } from 'immer'

export interface DocV1 {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

export type Doc = DocV1
export type FullVersionDoc = DocV1

export const VERSION = 0;

export interface DocState {
  docs: Doc[]
  setDocs: (docs: Doc[]) => void
  editDoc: (id: string, doc: Partial<Doc>, isMerge?: boolean) => void
  editDocContent: (id: string, content: string) => void
  createDoc: (content?: string, title?: string) => string
  copyDoc: (id: string) => void
}

export const useDocStore = create<DocState>()(
  persist(
    (set) => ({
      docs: [],
      setDocs: (docs) => set({ docs }),
      editDoc: (id, doc, isMerge = true) => {
        set((state) => produce(
          state,
          (draft) => {
            const index = draft.docs.findIndex((doc) => doc.id === id)
            if (index !== -1) {
              if (isMerge) {
                deepMerge(draft.docs[index], doc)
              } else {
                draft.docs[index] = { ...draft.docs[index], ...doc }
              }
              draft.docs[index].updatedAt = Date.now()
            }
          }
        ))
      },
      editDocContent: (id, content) => {
        set((state) => produce(
          state,
          (draft) => {
            const doc = draft.docs.find((doc) => doc.id === id)
            if (doc) {
              doc.content = content
              doc.updatedAt = Date.now()
            }
          }
        ))
      },
      createDoc: (content = '', title = '文档') => {
        const id = randomUUID()
        const doc = {
          id,
          title,
          content,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set((state) => produce(
          state,
          (draft) => {
            draft.docs.unshift(doc)
          }
        ))
        return id
      },
      copyDoc: (id) => {
        set((state) => produce(
          state,
          (draft) => {
            const doc = draft.docs.find((doc) => doc.id === id)
            if (doc) {
              const newDoc = {
                ...doc,
                id: randomUUID(),
                title: `${doc.title} - 副本`,
                createdAt: Date.now(),
                updatedAt:Date.now(),
              }
              draft.docs.unshift(newDoc)
            }
          }
        ))
      }
    }),
    {
      name: 'script-pad-doc',
      // storage: createDebouncedJSONStorage(docStorage, {
      //   debounceTime: 2000,
      // }),
      storage: createJSONStorage(() => docStorage),
      // 只持久化数据字段
      partialize: (state) => ({ docs: state.docs }),
      // 当前版本
      version: VERSION,
      migrate: (persistedState, version) => {
        // 读取到的版本如果低于当前版本，则需要做的迁移处理
        if (version === 0) {
          // persistedState.newState = persistedState.oldState
          // delete persistedState.oldState
          return persistedState
        }
        return persistedState
      },
      merge: (persistedState, currentState) => {
        // 读取的状态和 store 默认状态的深度合并，优先采用持久化了的状态
        return deepMerge(currentState, persistedState)
      },
    }
  )
)
