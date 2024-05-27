import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter } from '@/components/ui/drawer';
import { EventBus } from '@/utils/event';
import { memo, useCallback, useEffect, useState } from 'react';
import { Textarea } from './ui/textarea';
import { randomUUID } from '@/store/utils';

export const playgroundEventBus = new EventBus()

export const Playground = memo(() => {
  const [isShow, setIsShow] = useState<boolean>(false)
  const [contents, setContents] = useState<React.ReactNode[]>([])

  const showText = useCallback((text: string) => {
    setContents((oldList) => [
      ...oldList,
      <Textarea value={text} rows={5} readOnly className="resize-none" key={randomUUID()} />
    ])
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
        <div className="mx-auto w-full overflow-hidden">
          <div className="p-4 flex w-full overflow-auto flex-nowrap gap-4">
            {contents.map((Node, index) => {
              return (
                <div
                  key={index}
                  className="w-64 lg:w-96 xl:w-[500px] flex-shrink-0"
                >
                  {Node}
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
