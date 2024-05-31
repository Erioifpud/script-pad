import { ReactNode } from 'react'
import { create } from 'zustand'

export interface Content {
  type: 'text' | 'component'
  content: ReactNode,
  // payload 的类型确实是随意传的
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: Record<string, any>
}

// Playground 弹窗相关的状态
export interface PlaygroundState {
  isShow: boolean
  setIsShow: (isShow: boolean) => void
  toggle: () => void
  contents: Content[]
  setContents: (contents: Content[]) => void
  addContent: (content: Content) => void
}

export const usePlaygroundStore = create<PlaygroundState>()(
  (set) => ({
    isShow: false,
    setIsShow: (isShow) => set({ isShow }),
    toggle: () => set((state) => ({ isShow: !state.isShow })),
    contents: [],
    setContents: (contents) => set({ contents }),
    addContent: (content) => set((state) => ({ contents: [content, ...state.contents] })),
  })
)