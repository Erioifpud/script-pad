import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu';
import { HTMLProps, memo } from 'react';

type listener = () => void

interface Item {
  id: string;
  label: string;
  onClick: listener;
  className?: HTMLProps<HTMLElement>['className'];
}

interface MenuProps {
  children: React.ReactNode;
  items: Item[];
}

const ActionMenu = memo((props: MenuProps) => {
  const { children, items } = props;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel inset>动作</ContextMenuLabel>
        <ContextMenuSeparator />
        {items.map(({ id, label, onClick, className }) => (
          <ContextMenuItem
            key={id}
            className={className}
            onClick={() => onClick()}
          >
            {label}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  )
})

export default ActionMenu;