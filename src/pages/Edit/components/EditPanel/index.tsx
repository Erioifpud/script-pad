import { RefreshCwIcon } from 'lucide-react';
import Editor from '../Editor';
import { useCurrentScript } from '../../hooks/useCurrentScript';
import { memo, useCallback, useEffect, useState } from 'react';
import { useAppStore } from '@/store/app';
import { useDebounceEffect } from 'ahooks';
import { Script } from '@/store/app'
import { clipboard } from '@tauri-apps/api';
import { useToast } from '@/components/ui/use-toast';
import SettingButton from './SettingButton';

interface PropsTitle {
  script: Script
}

const Title = memo((props: PropsTitle) => {
  const { script } = props;
  const { toast } = useToast();

  const handleClick = useCallback(() => {
    clipboard.writeText(script.id).then(() => {
      toast({
        title: '复制成功',
        description: '脚本 ID 已复制到剪贴板',
      })
    })
  }, [script.id, toast])

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
  const [isSaved, setIsSaved] = useState(true);

  // 切换选中的草稿时恢复代码
  useEffect(() => {
    if (!currentScript) {
      return
    }
    setTempCode(currentScript.code || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScript?.id]);

  // 更新是否保存的状态
  useEffect(() => {
    setIsSaved(tempCode === currentScript?.code);
  }, [tempCode, currentScript?.code]);

  // 编辑器修改 tempCode，去抖后将 tempCode 保存到 store
  useDebounceEffect(
    () => {
      if (!currentScript) {
        return
      }
      if (tempCode === currentScript.code) {
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
        {isSaved ? null : (
          <RefreshCwIcon className="text-amber-500 text-lg w-6 h-6 mx-2 animate-spin"></RefreshCwIcon>
        )}
        <SettingButton script={currentScript} />
      </header>
      <div className="relative flex-grow h-full overflow-hidden">
        <Editor
          key={currentScript?.id}
          value={tempCode}
          onChange={setTempCode}
          readOnly={currentScript.readOnly}
        ></Editor>
      </div>
    </div>
  );
}
