import { create } from 'zustand'

// 这里放的是公共的状态，比如 scripts 要持久化，就放 app 中
// 这里的是程序里用到，但实际上没有什么意义的，也不需要持久化的状态
export interface CommonState {
  selectedScriptId: string
  setSelectedScriptId: (id: string) => void
}

export const useCommonStore = create<CommonState>()(
  (set) => ({
    selectedScriptId: '',
    setSelectedScriptId: (id) => set({ selectedScriptId: id }),
  })
)