import { produce } from 'immer'
import { create } from 'zustand'
import { FormDefaultValueMap, getDefaultValueMap, SettingKey, settingRules, SettingValueType } from './rule'
import { persist } from 'zustand/middleware'
import { merge as deepMerge } from 'lodash-es'
import { settingStorage } from '../utils/storage'
import { createDebouncedJSONStorage } from 'zustand-debounce'

const defaultValue = getDefaultValueMap(settingRules)

// 存放设置页面的表单数据
export interface SettingState {
  settings: FormDefaultValueMap
  setSetting: (key: SettingKey, value: SettingValueType) => void
}

const VERSION = 0

export const useSettingStore = create<SettingState>()(
  persist(
    (set) => ({
      settings: defaultValue,
      setSetting: (key, value) =>
        set(
          produce((state) => {
            state.settings[key] = value
          })
        ),
    }),
    {
      name: 'script-pad-setting',
      storage: createDebouncedJSONStorage(settingStorage, {
        debounceTime: 2000,
      }),
      // storage: createJSONStorage(() => settingStorage),
      // 只持久化数据字段
      partialize: (state) => ({ settings: state.settings }),
      // 当前版本
      version: VERSION,
      migrate: (persistedState, version) => {
        // 读取到的版本如果低于当前版本，则需要做的迁移处理
        if (version === 0) {
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