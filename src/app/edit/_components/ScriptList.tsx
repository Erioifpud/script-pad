'use client';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app';
import { PlusIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import { useCallback } from 'react';

export default function ScriptList () {
  const scripts = useAppStore(state => state.scripts);
  const createScript = useAppStore(state => state.createScript);
  const selectedScriptId = useAppStore(state => state.selectedScriptId);
  const setSelectedScriptId = useAppStore(state => state.setSelectedScriptId);

  const handleSelectScript = useCallback((scriptId: string) => {
    setSelectedScriptId(scriptId);
  }, [setSelectedScriptId])

  return (
    <div className="h-full flex-shrink-0 overflow-hidden flex flex-col border-r border-solid border-gray-200">
      <header className="border-b border-solid border-gray-200 h-[53px] flex-shrink-0 flex items-center justify-around">
        <Button size="sm" onClick={createScript}>
          <PlusIcon></PlusIcon>
        </Button>
      </header>
      <div className="flex-grow h-full overflow-auto w-52">
        {scripts.map(script => {
          return (
            <div
              key={script.id}
              onClick={() => handleSelectScript(script.id)}
              className={
                classNames(
                  "h-28 border-b border-solid border-gray-100 p-2",
                  selectedScriptId === script.id ? "bg-gray-100" : ""
                )
              }
            >
              {script.title}
            </div>
          )
        })}
      </div>
    </div>
  )
}