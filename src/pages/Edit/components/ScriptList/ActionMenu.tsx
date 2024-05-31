import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Script } from '@/store/app';
import { memo } from 'react';

interface MenuProps {
  children: React.ReactNode;
  script: Script;
  onExecute: (script: Script) => void;
  onDelete: (script: Script) => void;
  onPinned: (script: Script) => void;
  onCopy: (script: Script) => void;
}

const ActionMenu = memo((props: MenuProps) => {
  const { script, onExecute, onDelete, onCopy, children } = props;

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

export default ActionMenu;