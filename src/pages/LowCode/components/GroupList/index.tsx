'use client';
import ActionMenu from '@/components/ActionMenu';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useCommonStore } from '@/store/common';
import { useLowCodeStore } from '@/store/lowcode';
import { Group } from '@/store/lowcode/type';
import { PlusIcon } from 'lucide-react';
import { dialog } from '@tauri-apps/api';
import { memo, useCallback } from 'react';
import { cn } from '@/lib/utils';

const GroupList = memo(() => {
  const groups = useLowCodeStore(state => state.groups);
  const createGroup = useLowCodeStore(state => state.createGroup);
  const copyGroup = useLowCodeStore(state => state.copyGroup);
  const setGroups = useLowCodeStore(state => state.setGroups);
  const selectedGroupId = useCommonStore(state => state.selectedGroupId);
  const setSelectedGroupId = useCommonStore(state => state.setSelectedGroupId);

  const handleSelectGroup = useCallback((groupId: string) => {
    setSelectedGroupId(groupId);
  }, [setSelectedGroupId])

  // 删除组
  const handleDelete = useCallback((group: Group) => {
    dialog.confirm('确定删除该组？').then(flag => {
      if (!flag) {
        return
      }
      setGroups(groups.filter(item => item.id !== group.id))
    })
  }, [groups, setGroups])

  const handleCopy = useCallback((group: Group) => {
    copyGroup(group.id)
    toast({ title: '复制成功' })
  }, [copyGroup])

  return (
    <div className="relative h-full flex-shrink-0 overflow-hidden flex flex-col border-r border-solid border-gray-200 w-52 md:w-72">
      <header className="border-b border-solid border-gray-200 h-[53px] flex-shrink-0 flex items-center px-2 gap-1">
        <div className="flex-grow"></div>
        <Button size="sm" className="w-full" onClick={() => createGroup()}>
          <PlusIcon></PlusIcon>
          <span>创建</span>
        </Button>

      </header>
      <div className="flex-grow h-full overflow-auto">
        {groups.map(group => {
          return (
            <ActionMenu
              key={group.id}
              items={[
                { id: 'copy', label: '复制', onClick: () => handleCopy(group) },
                { id: 'delete', label: '删除', onClick: () => handleDelete(group), className: 'text-red-500' },
              ]}
            >
              <div
                onClick={() => handleSelectGroup(group.id)}
                className={
                  cn(
                    "h-28 border-b border-solid border-gray-100",
                    "p-4 items-start gap-4 space-y-0 w-full overflow-hidden",
                    selectedGroupId === group.id ? "bg-gray-100" : ""
                  )
                }
              >
                <div className="w-full overflow-hidden">
                  <h3 className="font-semibold leading-none tracking-tight">
                    {group.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 w-full whitespace-normal break-all text-wrap">
                    {group.description}
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
})

export default GroupList
