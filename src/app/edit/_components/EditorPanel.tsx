import { Button } from '@/components/ui/button';
import { GearIcon } from '@radix-ui/react-icons';
import Editor from './Editor';
import { useCurrentScript } from '../_hooks/useCurrentScript';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/app';
import { useDebounceEffect } from 'ahooks';

export default function EditPanel() {
  const currentScript = useCurrentScript();
  const editScriptCode = useAppStore((state) => state.editScriptCode);
  const [tempCode, setTempCode] = useState('');

  // 切换选中的草稿时恢复代码
  useEffect(() => {
    if (!currentScript) {
      return
    }
    setTempCode(currentScript.code || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScript?.id]);

  // 编辑器修改 tempCode，去抖后将 tempCode 保存到 store
  useDebounceEffect(
    () => {
      if (!currentScript) {
        return
      }
      editScriptCode(currentScript.id, tempCode);
    },
    [tempCode],
  { wait: 1000 }
  )

  if (!currentScript) {
    return <div className="w-full h-full flex justify-center items-center">请在左侧选择脚本</div>;
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4 flex-shrink-0">
        <h1 className="text-xl font-semibold">
          草稿 1
        </h1>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto gap-1.5 text-sm"
        >
          <GearIcon className="size-3.5" />
          设置
        </Button>
      </header>
      <div className="relative flex-grow h-full overflow-hidden">
        <Editor
          value={tempCode}
          onChange={setTempCode}
        ></Editor>
      </div>
    </div>
  );
}
