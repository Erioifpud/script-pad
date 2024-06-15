'use client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Script, useAppStore } from '@/store/app';
import { useCommonStore } from '@/store/common';
import { executeScript } from '@/vm';
import { DrawingPinFilledIcon, EyeOpenIcon, PlusIcon } from '@radix-ui/react-icons';
import { dialog } from '@tauri-apps/api';
import classNames from 'classnames';
import { memo, useCallback } from 'react';
import { OptionsButton } from './OptionsButton';
import ActionMenu from '@/components/ActionMenu';

const ScriptList = memo(() => {
  const scripts = useAppStore(state => state.scripts);
  const createScript = useAppStore(state => state.createScript);
  const copyScript = useAppStore(state => state.copyScript);
  const setScripts = useAppStore(state => state.setScripts);
  const toggleScriptPin = useAppStore(state => state.toggleScriptPin);
  const toggleScriptReadOnly = useAppStore(state => state.toggleScriptReadOnly);
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
    toggleScriptPin(script.id);
    toast({ title: '操作成功' })
  }, [toggleScriptPin])

  // 脚本只读
  const handleReadOnly = useCallback((script: Script) => {
    toggleScriptReadOnly(script.id);
    toast({ title: '操作成功' })
  }, [toggleScriptReadOnly])

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
              items={[
                { id: 'run', label: '运行', onClick: () => handleExecute(script) },
                { id: 'copy', label: '复制', onClick: () => handleCopy(script) },
                { id: 'pin', label: script.pinned ? '解除固定' : '固定到首页', onClick: () => handlePinned(script) },
                { id: 'readonly', label: script.readOnly ? '取消只读' : '设置只读', onClick: () => handleReadOnly(script) },
                { id: 'remove', label: '删除', onClick: () => handleDelete(script), className: 'text-red-500' }
              ]}
            >
              <div
                onClick={() => handleSelectScript(script.id)}
                className={
                  classNames(
                    "h-28 border-b border-solid border-gray-100",
                    "p-4 pb-2 w-full overflow-hidden flex flex-col h-28",
                    selectedScriptId === script.id ? "bg-gray-100" : ""
                  )
                }
              >
                <div className="w-full overflow-hidden flex-grow h-full flex flex-col">
                  <h3 className="font-semibold leading-none tracking-tight">
                    {script.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 w-full whitespace-normal break-all text-wrap">
                    {script.description}
                  </p>
                </div>
                <div className="action flex-shrink-0 text-xs flex justify-end">
                  {script.readOnly && <EyeOpenIcon className="w-4 h-4 ml-2" />}
                  {script.pinned && <DrawingPinFilledIcon className="w-4 h-4 ml-2" />}
                </div>
              </div>
            </ActionMenu>
          )
        })}
      </div>
    </div>
  )
})

export default ScriptList
