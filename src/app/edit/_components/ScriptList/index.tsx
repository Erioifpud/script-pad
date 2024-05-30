'use client';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu';
import { toast } from '@/components/ui/use-toast';
import { Script, useAppStore } from '@/store/app';
import { useCommonStore } from '@/store/common';
import { executeScript } from '@/vm';
import { DotsVerticalIcon, PlusIcon } from '@radix-ui/react-icons';
import { dialog } from '@tauri-apps/api';
import classNames from 'classnames';
import { memo, useCallback } from 'react';
import { OptionsButton } from './OptionsButton';

interface MenuProps {
  children: React.ReactNode;
  script: Script;
  onExecute: (script: Script) => void;
  onDelete: (script: Script) => void;
  onPinned: (script: Script) => void;
  onCopy: (script: Script) => void;
}

const ActionMenu = memo((props: MenuProps) => {
  const { script, onExecute, onDelete, onPinned, onCopy, children } = props;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel inset>动作</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem inset onClick={() => onExecute(script)}>
          运行
        </ContextMenuItem>
        <ContextMenuItem inset onClick={() => onCopy(script)}>
          复制
        </ContextMenuItem>
        <ContextMenuItem inset className="text-red-500" onClick={() => onDelete(script)}>
          删除
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
})

ActionMenu.displayName = 'ActionMenu';

function ScriptList () {
  const scripts = useAppStore(state => state.scripts);
  const createScript = useAppStore(state => state.createScript);
  const copyScript = useAppStore(state => state.copyScript);
  const setScripts = useAppStore(state => state.setScripts);
  const selectedScriptId = useCommonStore(state => state.selectedScriptId);
  const setSelectedScriptId = useCommonStore(state => state.setSelectedScriptId);

  const handleSelectScript = useCallback((scriptId: string) => {
    setSelectedScriptId(scriptId);
  }, [setSelectedScriptId])

  // 执行脚本
  const handleExecute = useCallback((script: Script) => {
    executeScript(script.code, script.globalVars);
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

  const handleCopy = useCallback((script: Script) => {
    copyScript(script.id)
    toast({ title: '复制成功' })
  }, [copyScript])

  // 固定脚本
  const handlePinned = useCallback((script: Script) => {
    console.log('pinned', script);
  }, [])

  return (
    <div className="relative h-full flex-shrink-0 overflow-hidden flex flex-col border-r border-solid border-gray-200 w-52 md:w-72 lg:w-96 xl:w-[420px]">
      <header className="border-b border-solid border-gray-200 h-[53px] flex-shrink-0 flex items-center px-2 gap-1">
        <div className="flex-grow"></div>
        <Button size="sm" className="w-full" onClick={createScript}>
          <PlusIcon></PlusIcon>
          <span>创建</span>
        </Button>
        <OptionsButton />

      </header>
      <div className="flex-grow h-full overflow-auto">
        {scripts.map(script => {
          return (
            <ActionMenu
              key={script.id}
              script={script}
              onExecute={handleExecute}
              onCopy={handleCopy}
              onDelete={handleDelete}
              onPinned={handlePinned}
            >
              <div
                onClick={() => handleSelectScript(script.id)}
                className={
                  classNames(
                    "h-28 border-b border-solid border-gray-100",
                    "p-4 items-start gap-4 space-y-0 w-full overflow-hidden",
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

                </div>
              </div>
            </ActionMenu>
          )
        })}
      </div>
    </div>
  )
}

export default memo(ScriptList)
