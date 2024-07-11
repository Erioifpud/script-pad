import { produce } from 'immer'
import { create } from 'zustand'

// 存放缓存数据，比如 HTTP 调用，参数 data 按 taskId 存到这里，调用后的数据也保存到这里，结束后从这里捞数据并清理
export interface CacheState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  httpRequest: Record<string, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  httpResponse: Record<string, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setHttpRequest: (id: string, data: any) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setHttpResponse: (id: string, data: any) => void,
  removeHttpTask: (id: string) => void,
}

export const useCacheStore = create<CacheState>()(
  (set) => ({
    httpRequest: {},
    httpResponse: {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setHttpRequest: (id: string, data: any) => {
      set((state) => produce(state, (draft) => {
        draft.httpRequest[id] = data
      }))
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setHttpResponse: (id: string, data: any) => {
      set((state) => produce(state, (draft) => {
        draft.httpResponse[id] = data
      }))
    },
    removeHttpTask: (id: string) => {
      set((state) => produce(state, (draft) => {
        delete draft.httpRequest[id]
        delete draft.httpResponse[id]
      }))
    },
  })
)