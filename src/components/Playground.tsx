import { Button } from '@/components/ui/button';
import { EventBus } from '@/utils/event';
import { CSSProperties, ReactNode, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Textarea } from './ui/textarea';
import { createPortal } from 'react-dom';
import { Sheet, SheetClose, SheetContent, SheetFooter } from './ui/sheet';
import { ArrowUpIcon } from '@radix-ui/react-icons';
import { downloadImage, takeScreenshot } from '@/utils';
import { useToast } from './ui/use-toast';
import { usePlaygroundStore } from '@/store/playground';
import { dialog } from '@tauri-apps/api';

interface WrapperProps {
  children: ReactNode
  payload?: Record<string, any>
}

// 为组件隔离样式
const Wrapper = memo((props: WrapperProps) => {
  const { toast } = useToast()
  const { payload } = props
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const mountNode = useMemo(() => {
    if (!contentRef) return null
    return contentRef.contentWindow?.document.body
  }, [contentRef])

  const handleShot = useCallback(async () => {
    if (!containerRef.current) return
    const data: string = await takeScreenshot(containerRef.current)
    const success = await downloadImage(data, '保存组件截图')
    if (success) {
      toast({ description: '截图保存成功' })
    }
  }, [toast])

  return (
    <>
      <iframe
        frameBorder={0}
        ref={setContentRef}
        className="relative w-full h-full"
        style={payload?.wrapperStyle || {}}
      >
        {mountNode && createPortal((
          <>
            <style>{`html, body { margin: 0; padding: 0; }`}</style>
            {payload && payload.style && <style type="text/css">{payload.style}</style>}
            <div
              style={{
                position: 'relative',
                width: 'fit-content',
                height: 'fit-content',
                display: 'inline-block',
              }}
              ref={containerRef}
            >
              {props.children}
            </div>
          </>
        ), mountNode)}
      </iframe>
      <div className="flex justify-between">
        <Button variant="default" className="w-full mt-2" onClick={handleShot}>
          <ArrowUpIcon></ArrowUpIcon>
          截图
        </Button>
      </div>
    </>
  )
})

Wrapper.displayName = 'Wrapper'

export const playgroundEventBus = new EventBus()

export const Playground = memo(() => {
  const isShow = usePlaygroundStore((state) => state.isShow)
  const setIsShow = usePlaygroundStore((state) => state.setIsShow)
  const contents = usePlaygroundStore((state) => state.contents)
  const addContent = usePlaygroundStore((state) => state.addContent)
  const setContents = usePlaygroundStore((state) => state.setContents)

  const handleClear = useCallback(() => {
    dialog.ask('确定要清空内容吗？', { type: 'warning' }).then((res) => {
      if (res) {
        setContents([])
      }
    })
  }, [setContents])

  // 显示文本
  const showText = useCallback((text: string) => {
    addContent({
      type: 'text',
      content: <Textarea value={text} rows={5} readOnly className="resize-none" />
    })
    setIsShow(true)
  }, [addContent, setIsShow])

  // 显示组件（带样式隔离）
  const showComponent = useCallback((Component: React.ReactNode, style: string, wrapperStyle: CSSProperties) => {
    addContent({
      type: 'component',
      content: <Wrapper payload={{ style, wrapperStyle }}>{Component}</Wrapper>
    })
    setIsShow(true)
  }, [addContent, setIsShow])

  // 显示组件（不带样式隔离，需要使用内联样式）
  const showRawComponent = useCallback((Component: React.ReactNode) => {
    addContent({
      type: 'component',
      content: Component
    })
    setIsShow(true)
  }, [addContent, setIsShow])

  useEffect(() => {
    playgroundEventBus.on('show-text', showText)
    playgroundEventBus.on('show-component', (node: React.ReactNode, style: string, wrapperStyle: CSSProperties) => {
      showComponent(node, style, wrapperStyle)
    })
    playgroundEventBus.on('show-raw-component', showRawComponent)
    return () => {
      playgroundEventBus.clear('show-text')
      playgroundEventBus.clear('show-component')
      playgroundEventBus.clear('show-raw-component')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Sheet
      open={isShow}
      onOpenChange={setIsShow}
    >
      <SheetContent className="w-[600px] max-w-[600px] min-w-[600px] h-full">
        <div className="w-full h-full overflow-hidden pb-10 pt-4">
          <div className="py-4 flex flex-col w-full h-full overflow-auto flex-nowrap gap-4">
            {contents.map((content, index) => {
              return (
                <div
                  key={index}
                  className="w-64 lg:w-[550px] flex-shrink-0"
                >
                  {content.content}
                </div>
              )
            })}
          </div>
          <SheetFooter className="flex justify-between">
            <Button variant="destructive" onClick={handleClear}>清空</Button>
            <SheetClose asChild>
              <Button variant="outline">确定</Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
})

Playground.displayName = 'Playground'

export const showText = (text: string) => {
  playgroundEventBus.emit('show-text', text)
}

export const showComponent = (node: ReactNode, style: string = '', wrapperStyle: CSSProperties = {}) => {
  playgroundEventBus.emit('show-component', node, style, wrapperStyle)
}

export const showRawComponent = (node: ReactNode) => {
  playgroundEventBus.emit('show-raw-component', node)
}
