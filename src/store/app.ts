import { create } from 'zustand'
import { randomUUID } from './utils'
import { createJSONStorage, persist } from 'zustand/middleware'
import { appStorage } from './utils/storage'
import { cloneDeep, merge as deepMerge } from 'lodash-es'
// import { createDebouncedJSONStorage } from 'zustand-debounce'
import { produce } from 'immer'

const DEFAULT_CODE =`// 运行环境在 Async 的 iife 中
await App.start()
console.log('Hello World!')
await App.done()
`

interface GlobalVars {
  [key: string]: string
}

export interface ScriptV1 {
  id: string
  title: string
  description: string
  globalVars: GlobalVars
  code: string
  pinned: boolean
  createdAt: number
  updatedAt: number
}

export interface ScriptV2 extends ScriptV1 {
  readOnly: boolean
}

export type Script = ScriptV2
export type FullVersionScript = ScriptV1 & ScriptV2

export const VERSION = 1;

export interface AppState {
  scripts: Script[]
  setScripts: (scripts: Script[]) => void
  editScript: (id: string, script: Partial<Script>, isMerge?: boolean) => void
  editScriptCode: (id: string, code: string) => void
  createScript: () => void
  copyScript: (id: string) => void
  toggleScriptPin: (id: string) => void
  toggleScriptReadOnly: (id: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      scripts: [],
      setScripts: (scripts) => set({ scripts }),
      editScript: (id, script, isMerge = true) => {
        set((state) => produce(
          state,
          (draft) => {
            const index = draft.scripts.findIndex((script) => script.id === id)
            if (index !== -1) {
              if (isMerge) {
                deepMerge(draft.scripts[index], script)
              } else {
                draft.scripts[index] = { ...draft.scripts[index], ...script }
              }
              draft.scripts[index].updatedAt = Date.now()
            }
          }
        ))
      },
      editScriptCode: (id, code) => {
        set((state) => produce(
          state,
          (draft) => {
            const script = draft.scripts.find((script) => script.id === id)
            if (script) {
              script.code = code
              script.updatedAt = Date.now()
            }
          }
        ))
      },
      createScript: () => {
        const script = {
          id: randomUUID(),
          title: '草稿',
          description: '',
          globalVars: {},
          code: DEFAULT_CODE,
          pinned: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          readOnly: false,
        }
        set((state) => produce(
          state,
          (draft) => {
            draft.scripts.unshift(script)
          }
        ))
      },
      copyScript: (id) => {
        set((state) => produce(
          state,
          (draft) => {
            const script = draft.scripts.find((script) => script.id === id)
            if (script) {
              const newScript = {
                // 要深拷贝，因为 script.globalVars 是引用类型
                ...cloneDeep(script),
                id: randomUUID(),
                title: `${script.title} - 副本`,
                createdAt: Date.now(),
                updatedAt:Date.now(),
                pinned: false,
              }
              draft.scripts.unshift(newScript)
            }
          }
        ))
      },
      toggleScriptPin: (id) => {
        set((state) => produce(
          state,
          (draft) => {
            const script = draft.scripts.find((script) => script.id === id)
            if (script) {
              script.pinned = !script.pinned
              // 这个操作无需修改 updatedAt
              // script.updatedAt = Date.now()
            }
          }
        ))
      },
      toggleScriptReadOnly: (id) => {
        set((state) => produce(
          state,
          (draft) => {
            const script = draft.scripts.find((script) => script.id === id)
            if (script) {
              script.readOnly = !script.readOnly
              // 这个操作无需修改 updatedAt
              // script.updatedAt = Date.now()
            }
          }
        ))
      },
    }),
    {
      name: 'script-pad-app',
      // storage: createDebouncedJSONStorage(appStorage, {
      //   debounceTime: 2000,
      // }),
      storage: createJSONStorage(() => appStorage),
      // 只持久化数据字段
      partialize: (state) => ({ scripts: state.scripts }),
      // 当前版本
      version: VERSION,
      // eslint-disable-next-line
      migrate: (persistedState: any, version) => {
        // 读取到的版本如果低于当前版本，则需要做的迁移处理
        if (version === 0) {
          persistedState.readOnly = false
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
