import IndicatorButton from '@/components/IndicatorButton';
import { InputDialog } from '@/components/InputDialog';
import Log from '@/components/Log';
import { Playground } from '@/components/Playground';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { router } from '@/router';
import { usePlaygroundStore } from '@/store/playground';
import { ArchiveIcon, BackpackIcon, CodeIcon, CodeSandboxLogoIcon, DesktopIcon, ReaderIcon } from '@radix-ui/react-icons';
import { invoke, path } from '@tauri-apps/api';
import classNames from 'classnames';
import { useCallback } from 'react';

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
          className={classNames(
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
                <CodeIcon />
              </TooltipButton>

              <TooltipButton
                className="bg-muted"
                onClick={() => { router.navigate('/doc') }}
                tooltip="笔记本"
              >
                <BackpackIcon />
              </TooltipButton>

              <TooltipButton
                className="bg-muted"
                onClick={() => { router.navigate('/lowcode') }}
                tooltip="低代码组件"
              >
                <CodeSandboxLogoIcon />
              </TooltipButton>

              <div className="flex-grow"></div>

              <TooltipButton
                className="bg-red-400 row-span-2 text-white hover:bg-red-200"
                onClick={handleOpenDevtool}
                tooltip="日志"
              >
                <DesktopIcon />
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
                <DesktopIcon />
              </TooltipButton>

              <TooltipButton
                className="bg-blue-500 row-span-2 text-white hover:bg-blue-200"
                onClick={() => window.open('https://erioifpud.github.io/script-pad-docs/', '_blank')}
                tooltip="文档"
              >
                <ReaderIcon />
              </TooltipButton>
            </nav>
          </aside>
          <div className="flex flex-col h-full overflow-hidden">
            {children}
          </div>
        </div>
      </TooltipProvider>
      <Log />
      <Playground />
      <InputDialog />
      <Toaster />
    </div>
  );
}
