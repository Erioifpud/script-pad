import { ReactNode } from 'react'
import { create } from 'zustand'
import { randomUUID } from './utils'

export type LogContent = ReactNode | string | number | boolean | undefined | null | symbol | bigint | object

export interface LogItem {
  id: string
  timestamp: number
  contents: LogContent[]
  type: string
}

// Log 与弹窗相关的状态
export interface LogState {
  isShow: boolean;
  toggle: () => void;
  setIsShow: (isShow: boolean) => void;
  // 用列表收集日志
  logs: LogItem[];
  addLog: (type: string, contents: LogContent[]) => void,
  setLogs: (logs: LogItem[]) => void;
}

export const useLogStore = create<LogState>()(
  (set) => ({
    isShow: false,
    toggle() {
      set((state) => ({
        isShow: !state.isShow,
      }))
    },
    setIsShow(isShow) {
      set({ isShow })
    },
    logs: [],
    addLog(type: string, contents: LogContent[]) {
      set((state) => ({
        logs: [
          ...state.logs,
          {
            id: randomUUID(),
            timestamp: Date.now(),
            contents,
            type
          },
        ],
      }))
    },
    setLogs(logs) {
      set({ logs })
    },
  })
)