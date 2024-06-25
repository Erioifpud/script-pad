import { UpdateIcon } from '@radix-ui/react-icons';
import Editor from '../Editor';
import { memo, useCallback, useEffect, useState } from 'react';
import { useDebounceEffect } from 'ahooks';
import { clipboard } from '@tauri-apps/api';
import { useToast } from '@/components/ui/use-toast';
import SettingButton from './SettingButton';
import { Doc, useDocStore } from '@/store/doc';
import { useCurrentDoc } from '../../hooks/useCurrentDoc';

interface PropsTitle {
  doc: Doc
}

const Title = memo((props: PropsTitle) => {
  const { doc } = props;
  const { toast } = useToast();

  const handleClick = useCallback(() => {
    clipboard.writeText(doc.id).then(() => {
      toast({
        title: '复制成功',
        description: '笔记本 ID 已复制到剪贴板',
      })
    })
  }, [doc.id, toast])

  return (
    <h1 className="text-xl font-semibold w-full overflow-hidden flex-grow">
      <div
        className="truncate cursor-pointer"
        onClick={handleClick}
      >
        {doc.title}
      </div>
    </h1>
  )
});

Title.displayName = 'Title';

export default function EditPanel() {
  const currentDoc = useCurrentDoc();
  const editDocContent = useDocStore((state) => state.editDocContent);
  const [tempContent, setTempContent] = useState('');
  const [isSaved, setIsSaved] = useState(true);

  // 切换选中的草稿时恢复代码
  useEffect(() => {
    if (!currentDoc) {
      return
    }
    setTempContent(currentDoc.content || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDoc?.id]);

  // 更新是否保存的状态
  useEffect(() => {
    setIsSaved(tempContent === currentDoc?.content);
  }, [tempContent, currentDoc?.content]);

  // 编辑器修改 tempContent，去抖后将 tempContent 保存到 store
  useDebounceEffect(
    () => {
      if (!currentDoc) {
        return
      }
      editDocContent(currentDoc.id, tempContent);
    },
    [tempContent],
  { wait: 1000 }
  )

  if (!currentDoc) {
    return <div className="w-full h-full flex justify-center items-center">请在左侧选择笔记本</div>;
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4 flex-shrink-0">
        <Title doc={currentDoc}></Title>
        {isSaved ? null : (
          <UpdateIcon className="text-amber-500 text-lg w-6 h-6 mx-2 animate-spin"></UpdateIcon>
        )}
        <SettingButton doc={currentDoc} />
      </header>
      <div className="relative flex-grow h-full overflow-hidden">
        <Editor
          key={currentDoc?.id}
          value={tempContent}
          onChange={setTempContent}
        ></Editor>
      </div>
    </div>
  );
}
