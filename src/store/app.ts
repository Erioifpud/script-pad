import { create } from 'zustand'
import { createSelectors } from './utils'
import { createJSONStorage, persist } from 'zustand/middleware'
import { appStorage } from './utils/storage'
import { merge as deepMerge } from 'lodash-es'

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
}

export type Script = ScriptV1
export type FullVersionScript = ScriptV1

export interface AppState {
  scripts: Script[]
  setScripts: (scripts: Script[]) => void
}

const AppStore = create<AppState>()(
  persist(
    (set) => ({
      scripts: [],
      setScripts: (scripts) => set({ scripts }),
    }),
    {
      name: 'script-pad-app',
      storage: createJSONStorage(() => appStorage),
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

export const useAppStore = createSelectors(AppStore)