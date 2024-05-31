'use client';
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Playground } from '@/components/Playground';
import { InputDialog } from '@/components/InputDialog';
import { ArchiveIcon, CodeIcon, DesktopIcon, ReaderIcon } from '@radix-ui/react-icons';
import IndicatorButton from '@/components/IndicatorButton';
import classNames from 'classnames';
import { usePlaygroundStore } from '@/store/playground';
import { useLogStore } from '@/store/log';
import Log from '@/components/Log';

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const togglePlayground = usePlaygroundStore(state => state.toggle)
  const toggleLog = useLogStore(state => state.toggle)

  return (
    <html lang="en">
      <body className={inter.className}>
        <TooltipProvider>
          <div className="grid h-screen w-full pl-[53px]">
            <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
              <div className="border-b p-2">
                <IndicatorButton />
              </div>
              <nav className="flex flex-col gap-2 p-2 h-full">
                <TooltipButton
                  className="bg-muted"
                  onClick={() => {}}
                  tooltip="脚本编辑"
                >
                  <CodeIcon />
                </TooltipButton>

                <div className="flex-grow"></div>

                <TooltipButton
                  className="bg-red-400 row-span-2 text-white hover:bg-red-200"
                  onClick={toggleLog}
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
      </body>
    </html>
  );
}
