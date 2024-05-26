import { Button } from '@/components/ui/button';
import { GearIcon } from '@radix-ui/react-icons';
import Editor from './Editor';
import { useCurrentScript } from '../_hooks/useCurrentScript';
import { memo, useCallback, useEffect, useState } from 'react';
import { useAppStore } from '@/store/app';
import { useDebounceEffect } from 'ahooks';
import { Script } from '@/store/app'
import { clipboard } from '@tauri-apps/api';

interface PropsTitle {
  script: Script
}

const Title = memo((props: PropsTitle) => {
  const { script } = props;

  const handleClick = useCallback(() => {
    clipboard.writeText(script.id).then(() => {
      console.log('复制成功');
    })
  }, [script])

  return (
    <h1 className="text-xl font-semibold w-full overflow-hidden flex-grow">
      <div
        className="truncate cursor-pointer"
        onClick={handleClick}
      >
        {script.title}
      </div>
    </h1>
  )
});

Title.displayName = 'Title';

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
        <Title script={currentScript}></Title>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto gap-1.5 text-sm flex-shrink-0"
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
