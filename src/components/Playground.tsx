import { Button } from '@/components/ui/button';
import { EventBus } from '@/utils/event';
import { ReactNode, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Textarea } from './ui/textarea';
import { createPortal } from 'react-dom';
import { Sheet, SheetClose, SheetContent, SheetFooter } from './ui/sheet';

interface WrapperProps {
  children: ReactNode
  payload?: Record<string, any>
}

// 为组件隔离样式
const Wrapper = memo((props: WrapperProps) => {
  const { payload } = props
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null)
  const mountNode = useMemo(() => {
    if (!contentRef) return null
    return contentRef.contentWindow?.document.body
  }, [contentRef])

  return (
    <iframe
      frameBorder={0}
      ref={setContentRef}
      className="relative w-full h-full"
    >
      {mountNode && createPortal((
        <>
          {payload && payload.style && <style type="text/css">{payload.style}</style>}
          {props.children}
        </>
      ), mountNode)}
    </iframe>
  )
})

Wrapper.displayName = 'Wrapper'

export const playgroundEventBus = new EventBus()

interface Content {
  type: 'text' | 'component'
  content: ReactNode,
  payload?: Record<string, any>
}

export const Playground = memo(() => {
  const [isShow, setIsShow] = useState<boolean>(false)
  const [contents, setContents] = useState<Content[]>([])

  // 显示文本
  const showText = useCallback((text: string) => {
    setContents((oldList) => [
      ...oldList,
      {
        type: 'text',
        content: <Textarea value={text} rows={5} readOnly className="resize-none" />
      }
    ])
    setIsShow(true)
  }, [])

  // 显示组件（带样式隔离）
  const showComponent = useCallback((Component: React.ReactNode, style: string) => {
    setContents((oldList) => [
      ...oldList,
      {
        type: 'component',
        content: <Wrapper payload={{ style }}>{Component}</Wrapper>
      }
    ])
    setIsShow(true)
  }, [])

  // 显示组件（不带样式隔离，需要使用内联样式）
  const showRawComponent = useCallback((Component: React.ReactNode) => {
    setContents((oldList) => [
      ...oldList,
      {
        type: 'component',
        content: Component
      }
    ])
    setIsShow(true)
  }, [])

  useEffect(() => {
    playgroundEventBus.on('show-text', showText)
    playgroundEventBus.on('show-component', (node: React.ReactNode, style: string, height: string) => {
      showComponent(node, style)
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
          <SheetFooter>
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

export const showComponent = (node: ReactNode, style: string = '') => {
  playgroundEventBus.emit('show-component', node, style)
}

export const showRawComponent = (node: ReactNode) => {
  playgroundEventBus.emit('show-raw-component', node)
}
