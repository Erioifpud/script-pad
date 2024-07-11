import { useCacheStore } from '@/store/cache';
import { emit } from '@tauri-apps/api/event';

enum Mode {
  LOCAL = 0,
  HTTP = 1
}

export class RemoteCall {
  static win = window;

  static async getMode() {
    if ('$httpTaskId' in RemoteCall.win) {
      return Mode.HTTP;
    }
    return Mode.LOCAL;
  }

  static async getBody() {
    const mode = await RemoteCall.getMode();
    if (mode === Mode.HTTP) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const taskId = (RemoteCall.win as any).$httpTaskId as string
      const state = useCacheStore.getState()
      return state.httpRequest[taskId]
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async toResponse(data: any) {
    const mode = await RemoteCall.getMode();
    if (mode === Mode.HTTP) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const taskId = (RemoteCall.win as any).$httpTaskId as string
      const state = useCacheStore.getState()
      state.setHttpResponse(taskId, data)
      return
    }
  }

  static async _stopTask() {
    const mode = await RemoteCall.getMode();
    if (mode === Mode.HTTP) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const taskId = (RemoteCall.win as any).$httpTaskId as string
      const state = useCacheStore.getState()
      // 回传结果，然后清空缓存
      emit('remote/http-response', {
        taskId,
        data: state.httpResponse[taskId] || null
      })
      state.removeHttpTask(taskId)
    }
  }
}

