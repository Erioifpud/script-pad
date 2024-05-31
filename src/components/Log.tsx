import { useLogStore } from '@/store/log';
import { Button } from './ui/button';
import { Sheet, SheetClose, SheetContent, SheetFooter } from './ui/sheet';
import { useCallback } from 'react';
import { ObjectInspector } from 'react-inspector'
import classNames from 'classnames';
import { formatTime } from '@/utils/date';

const Log = () => {
  const isShow = useLogStore(state => state.isShow);
  const setIsShow = useLogStore(state => state.setIsShow);
  const setLogs = useLogStore(state => state.setLogs);
  const logs = useLogStore(state => state.logs);

  const handleClear = useCallback(() => {
    setLogs([]);
  }, [setLogs]);

  return (
    <Sheet
      open={isShow}
      onOpenChange={setIsShow}
    >
      <SheetContent className="h-1/2 w-full" side="bottom">
        <div className="w-full h-full overflow-hidden pb-10 pt-4">
          <div className="p-2 flex flex-col w-full h-full overflow-auto flex-nowrap gap-4 overflow-x-hidden border border-dashed border-gray-400 rounded-md">
            {logs.map((log) => {
              return (
                // 一行日志
                <div
                  key={log.id}
                  className="w-full text-wrap flex-shrink-0 text-xs flex flex-col"
                >
                  <div className={classNames(
                    {
                      'text-gray-700': log.type === 'log',
                      'text-blue-400': log.type === 'info',
                      'text-amber-500': log.type === 'warn',
                      'text-red-500': log.type === 'error',
                      'text-purple-600': log.type === 'debug',
                    }
                  )}>
                    <span className="font-bold">{`[${log.type.toUpperCase()}]`}</span>
                    &nbsp;{formatTime(log.timestamp)}:
                  </div>
                  <div className="text-gray-700 text-xs pl-3">
                    {log.contents.map((content, index) => {
                      // if (content === undefined) {
                      //   return <span className="inline-block mx-1 underline" key={index}>undefined</span>
                      // }
                      // if (content === null) {
                      //   return <span className="inline-block mx-1 underline" key={index}>null</span>
                      // }
                      // const type = typeof content;
                      // if (type === 'string') {
                      //   return <span className="inline-block mx-1 text-violet-500" key={index}>{content.toString()}</span>
                      // }
                      // if (type === 'number') {
                      //   return <span className="inline-block mx-1 text-amber-500" key={index}>{content.toString()}</span>
                      // }
                      // if (type === 'boolean') {
                      //   return <span className="inline-block mx-1 text-sky-600" key={index}>{content ? 'true' : 'false'}</span>
                      // }
                      // if (type === 'object') {
                      //   return <ObjectInspector data={content} key={index} />
                      // }
                      return <ObjectInspector data={content} key={index} />
                    })}
                  </div>
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
}

export default Log;