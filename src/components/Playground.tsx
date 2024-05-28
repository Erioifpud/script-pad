import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter } from '@/components/ui/drawer';
import { EventBus } from '@/utils/event';
import { ReactNode, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Textarea } from './ui/textarea';
import { createPortal } from 'react-dom';

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
    <iframe frameBorder={0} ref={setContentRef}>
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
    playgroundEventBus.on('show-component', (node: React.ReactNode, style: string) => showComponent(node, style))
    playgroundEventBus.on('show-raw-component', showRawComponent)
    return () => {
      playgroundEventBus.clear('show-text')
      playgroundEventBus.clear('show-component')
      playgroundEventBus.clear('show-raw-component')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Drawer
      open={isShow}
      onOpenChange={setIsShow}
    >
      <DrawerContent>
        <div className="mx-auto w-full overflow-hidden">
          <div className="p-4 flex w-full overflow-auto flex-nowrap gap-4">
            {contents.map((content, index) => {
              return (
                <div
                  key={index}
                  className="w-64 lg:w-96 xl:w-[500px] flex-shrink-0"
                >
                  {content.content}
                </div>
              )
            })}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">确定</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
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
