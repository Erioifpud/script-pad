import { useAppStore } from '@/store/app';
import { useCacheStore } from '@/store/cache';
import { executeScriptRaw } from '@/vm';
import { Event, listen } from '@tauri-apps/api/event';
import { useCallback, useEffect } from 'react';

interface Task {
  id: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  taskId: string
}

const useGlobalEvents = () => {
  const scripts = useAppStore(state => state.scripts)
  const setHttpRequest = useCacheStore(state => state.setHttpRequest)

  const runScript = useCallback((event: Event<Task>) => {
    const { taskId, id, data } = event.payload
    const script = scripts.find(s => s.id === id)
    if (!script) {
      return
    }

    // http 调用的参数存入 store
    setHttpRequest(taskId, data)
    // 执行脚本，并把任务 id 注入到上下文
    executeScriptRaw(script.code, script.globalVars, {
      $httpTaskId: taskId
    })
  }, [scripts, setHttpRequest])

  // 监听 http 请求
  useEffect(() => {
    const unlisten = listen<Task>('remote/http-request', (event) => {
      runScript(event)
    })
    return () => {
      unlisten.then(fn => fn())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scripts])
};

export default useGlobalEvents;