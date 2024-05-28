import { create } from 'zustand'
import { randomUUID } from './utils'
import { persist } from 'zustand/middleware'
import { appStorage } from './utils/storage'
import { merge as deepMerge } from 'lodash-es'
import { createDebouncedJSONStorage } from 'zustand-debounce'
import { produce } from 'immer'

const DEFAULT_CODE =`// 运行环境在 Async 的 iife 中
await App.start()
console.log('Hello World!')
await App.done()
`

interface GlobalVars {
  [key: string]: string
}

interface ScriptV1 {
  id: string
  title: string
  description: string
  globalVars: GlobalVars
  code: string
  pinned: boolean
  createdAt: number
  updatedAt: number
}

export type Script = ScriptV1
export type FullVersionScript = ScriptV1

export interface AppState {
  scripts: Script[]
  setScripts: (scripts: Script[]) => void
  editScript: (id: string, script: Partial<Script>, isMerge?: boolean) => void
  editScriptCode: (id: string, code: string) => void
  createScript: () => void
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
        }
        set((state) => produce(
          state,
          (draft) => {
            draft.scripts.unshift(script)
          }
        ))
      },
    }),
    {
      name: 'script-pad-app',
      storage: createDebouncedJSONStorage(appStorage, {
        debounceTime: 2000,
      }),
      // 只持久化数据字段
      partialize: (state) => ({ scripts: state.scripts }),
      // 当前版本
      version: 0,
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
