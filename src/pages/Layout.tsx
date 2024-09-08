import IndicatorButton from '@/components/IndicatorButton';
import { InputDialog } from '@/components/InputDialog';
import { Playground } from '@/components/Playground';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { router } from '@/router';
import { usePlaygroundStore } from '@/store/playground';
import { ArchiveIcon, NotebookIcon, BracesIcon, BrushIcon, SquareTerminalIcon, BookOpenTextIcon, HardDriveIcon, SettingsIcon } from 'lucide-react';
import { invoke, path } from '@tauri-apps/api';
import { useCallback } from 'react';
import MenuButton from '@/components/MenuButton';
import { cn } from '@/lib/utils';
import { WINDOW_PLUGIN } from '@/constants';

interface TooltipButtonProps {
  className?: string;
  onClick: () => void;
  children: React.ReactNode;
  tooltip: string;
}

function TooltipButton(props: TooltipButtonProps) {
  const { className, onClick, children, tooltip } = props

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "rounded-lg",
            className
          )}
          aria-label="Docs"
          onClick={onClick}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={5}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const togglePlayground = usePlaygroundStore(state => state.toggle)

  const handleOpenDevtool = useCallback(() => {
    invoke('open_devtools')
  }, [])

  const handleOpenDataDir = useCallback(async () => {
    const dir = await path.appDataDir();
    invoke('open_directory', {
      path: dir
    });
  }, [])

  const handleOpenDocs = useCallback(() => {
    invoke(WINDOW_PLUGIN.CREATE_WINDOW, {
      options: {
        label: 'docs',
        url: 'https://erioifpud.github.io/script-pad-docs/',
      },
      reusable: true,
    })
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden">
      <TooltipProvider>
        <div className="grid h-screen w-full pl-[53px]">
          <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
            <div className="border-b p-2">
              <IndicatorButton />
            </div>
            <nav className="flex flex-col gap-2 p-2 h-full">
              <TooltipButton
                className="bg-muted"
                onClick={() => { router.navigate('/edit') }}
                tooltip="脚本编辑"
              >
                <BracesIcon />
              </TooltipButton>

              <TooltipButton
                className="bg-muted"
                onClick={() => { router.navigate('/doc') }}
                tooltip="笔记本"
              >
                <NotebookIcon />
              </TooltipButton>

              <TooltipButton
                className="bg-muted"
                onClick={() => { router.navigate('/lowcode') }}
                tooltip="低代码组件"
              >
                <BrushIcon />
              </TooltipButton>

              <TooltipButton
                className="bg-muted"
                onClick={() => { router.navigate('/setting') }}
                tooltip="设置"
              >
                <SettingsIcon />
              </TooltipButton>

              <div className="flex-grow"></div>

              <TooltipButton
                className="bg-red-400 row-span-2 text-white hover:bg-red-200"
                onClick={handleOpenDevtool}
                tooltip="日志"
              >
                <SquareTerminalIcon />
              </TooltipButton>

              <TooltipButton
                className="bg-orange-400 row-span-2 text-white hover:bg-orange-200"
                onClick={togglePlayground}
                tooltip="试验场"
              >
                <ArchiveIcon />
              </TooltipButton>

              <TooltipButton
                className="bg-yellow-400 row-span-2 text-white hover:bg-yellow-200"
                onClick={handleOpenDataDir}
                tooltip="数据目录"
              >
                <HardDriveIcon />
              </TooltipButton>

              <TooltipButton
                className="bg-blue-500 row-span-2 text-white hover:bg-blue-200"
                onClick={handleOpenDocs}
                tooltip="文档"
              >
                <BookOpenTextIcon />
              </TooltipButton>

              <MenuButton />
            </nav>
          </aside>
          <div className="flex flex-col h-full overflow-hidden">
            {children}
          </div>
        </div>
      </TooltipProvider>
      <Playground />
      <InputDialog />
      <Toaster />
    </div>
  );
}
