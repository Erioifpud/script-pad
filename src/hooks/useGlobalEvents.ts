import { listen } from '@tauri-apps/api/event';
import { useEffect } from 'react';

const useGlobalEvents = () => {
  useEffect(() => {
    const unlisten = listen<string>('test', (event) => {
      console.log(event)
    })
    return () => {
      unlisten.then(fn => fn())
    }
  }, [])
};

export default useGlobalEvents;