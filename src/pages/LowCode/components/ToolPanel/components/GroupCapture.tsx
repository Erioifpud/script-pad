import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LowCodeContext } from '@/pages/LowCode/context/LowCodeContext/context';
import { Template } from '@/vm/modules/Template';
import { clipboard } from '@tauri-apps/api';
import { memo, useCallback, useContext } from 'react';

const GroupCapture = memo(() => {
  const { currentGroup } = useContext(LowCodeContext);
  const { toast } = useToast();

  const handleCopyCode = useCallback(async () => {
    if (!currentGroup) {
      return;
    }
    const code = await new Template().renderToString(currentGroup.id, currentGroup.mockData);
    await clipboard.writeText(code);
    toast({
      title: '复制成功',
      description: '代码已复制到剪贴板',
    })
  }, [currentGroup, toast])

  return (
    <div className="my-4">
      <Button size="sm" onClick={handleCopyCode} className="my-1 w-full bg-[#F59F00] hover:bg-[#F08C00]">复制代码</Button>
    </div>
  )
})

export default GroupCapture
