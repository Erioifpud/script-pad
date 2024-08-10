import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { LowCodeContext } from '@/pages/LowCode/context/LowCodeContext/context';
import { Template } from '@/vm/modules/Template';
import { clipboard } from '@tauri-apps/api';
import { CircleHelpIcon } from 'lucide-react';
import { memo, useCallback, useContext } from 'react';

const GroupCapture = memo(() => {
  const { currentGroup, exportGroup } = useContext(LowCodeContext);
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

  const handleExport = useCallback(async () => {
    await exportGroup()
    toast({
      title: '导出成功',
      description: '分组已导出到剪贴板',
    })
  }, [exportGroup, toast])

  return (
    <div className="my-4">
      <Button size="sm" onClick={handleCopyCode} className="my-1 w-full bg-[#20C997] hover:bg-[#12B886]">复制代码</Button>
      <div className="my-1 w-full flex gap-2 items-center">
        <Button size="sm" onClick={handleExport} className="bg-[#228BE6] hover:bg-[#1C7ED6] w-full">导出分组</Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <CircleHelpIcon className="text-gray-800" />
            </TooltipTrigger>
            <TooltipContent>
              <p>由于内容修改失误后可能导致整个页面报错，所以导出会带有签名防止二次修改</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
})

export default GroupCapture
