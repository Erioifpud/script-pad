import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter } from '@/components/ui/drawer';
import { EventBus } from '@/utils/event';
import { memo, useCallback, useEffect, useState } from 'react';
import { Textarea } from './ui/textarea';

export const playgroundEventBus = new EventBus()

export const Playground = memo(() => {
  const [isShow, setIsShow] = useState<boolean>(false)
  const [type, setType] = useState<string>('')
  const [content, setContent] = useState<React.ReactNode>(null)

  const showText = useCallback((text: string) => {
    setType('text')
    setContent(text)
    setIsShow(true)
  }, [])

  useEffect(() => {
    playgroundEventBus.on('show-text', showText)
    return () => {
      playgroundEventBus.clear('show-text')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Drawer
        open={isShow}
        onOpenChange={setIsShow}
      >
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <div className="p-4">
              {type === 'text' && (
                <Textarea value={content as string} rows={5} />
              )}
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
