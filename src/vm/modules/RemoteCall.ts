import { useCacheStore } from '@/store/cache';
import { emit } from '@tauri-apps/api/event';

enum Mode {
  LOCAL = 0,
  HTTP = 1
}

export class RemoteCall {
  private win: Window & typeof globalThis = window;

  setWin(win: Window & typeof globalThis) {
    this.win = win
  }

  async getMode() {
    if ('$httpTaskId' in this.win) {
      return Mode.HTTP;
    }
    return Mode.LOCAL;
  }

  async getBody() {
    const mode = await this.getMode();
    if (mode === Mode.HTTP) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const taskId = (this.win as any).$httpTaskId as string
      const state = useCacheStore.getState()
      return state.httpRequest[taskId]
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async toResponse(data: any) {
    const mode = await this.getMode();
    if (mode === Mode.HTTP) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const taskId = (this.win as any).$httpTaskId as string
      const state = useCacheStore.getState()
      state.setHttpResponse(taskId, data)
      return
    }
  }

  async _stopTask() {
    const mode = await this.getMode();
    if (mode === Mode.HTTP) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const taskId = (this.win as any).$httpTaskId as string
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

