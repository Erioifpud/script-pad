'use client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Script, useAppStore } from '@/store/app';
import { useCommonStore } from '@/store/common';
import { executeScript } from '@/vm';
import { ChevronDownIcon, PlusIcon } from '@radix-ui/react-icons';
import { dialog } from '@tauri-apps/api';
import classNames from 'classnames';
import { memo, useCallback } from 'react';

interface MenuProps {
  script: Script;
  onExecute: (script: Script) => void;
  onDelete: (script: Script) => void;
  onPinned: (script: Script) => void;
}

const ActionMenu = memo((props: MenuProps) => {
  const { script, onExecute, onDelete, onPinned } = props;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="icon">
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>动作</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onPinned(script)}>
          {script.pinned ? '取消固定' : '固定'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExecute(script)}>运行</DropdownMenuItem>
        <DropdownMenuItem className="text-red-500" onClick={() => onDelete(script)}>删除</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

ActionMenu.displayName = 'ActionMenu';

function ScriptList () {
  const scripts = useAppStore(state => state.scripts);
  const createScript = useAppStore(state => state.createScript);
  const setScripts = useAppStore(state => state.setScripts);
  const selectedScriptId = useCommonStore(state => state.selectedScriptId);
  const setSelectedScriptId = useCommonStore(state => state.setSelectedScriptId);

  const handleSelectScript = useCallback((scriptId: string) => {
    setSelectedScriptId(scriptId);
  }, [setSelectedScriptId])

  // 执行脚本
  const handleExecute = useCallback((script: Script) => {
    executeScript(script.code);
  }, [])

  // 删除脚本
  const handleDelete = useCallback((script: Script) => {
    dialog.confirm('确定删除该脚本？').then(flag => {
      if (!flag) {
        return
      }
      setScripts(scripts.filter(item => item.id !== script.id))
    })
  }, [scripts, setScripts])

  // 固定脚本
  const handlePinned = useCallback((script: Script) => {
    console.log('pinned', script);
  }, [])

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
                  "h-28 border-b border-solid border-gray-100",
                  "flex-col p-4 grid grid-cols-[1fr_39px] items-start gap-4 space-y-0 w-full overflow-hidden",
                  selectedScriptId === script.id ? "bg-gray-100" : ""
                )
              }
            >
              <div className="w-full overflow-hidden">
                <h3 className="font-semibold leading-none tracking-tight">
                  {script.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 w-full whitespace-normal break-all">
                  {script.description}
                </p>
              </div>
              <div className="action">
                <ActionMenu
                  script={script}
                  onExecute={handleExecute}
                  onDelete={handleDelete}
                  onPinned={handlePinned}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default memo(ScriptList)
