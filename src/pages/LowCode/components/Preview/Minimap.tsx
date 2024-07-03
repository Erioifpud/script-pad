import { AnyNode, Group, TreeNode } from '@/store/lowcode/type';
import React, { memo, useCallback, useContext } from 'react';
import { LowCodeContext } from '../../context/LowCodeContext/context';
import ActionMenu from '@/components/ActionMenu';
import { useToast } from '@/components/ui/use-toast';
import { produce } from 'immer';
import { dialog } from '@tauri-apps/api';
import { useLowCodeStore } from '@/store/lowcode';
import { cloneDeep } from 'lodash-es';
import { randomUUID } from '@/store/utils';
import { createNode } from '@/store/lowcode/utils';

interface RenderOptions {
  handleAdd: (id: string) => void;
  handleClick: (id: string, ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  selectedNodeId: string;
  handleCopy: (id: string) => void;
  handleDelete: (id: string) => void;
  handleMove: (id: string, direction: 'up' | 'down') => void;
}

function renderTreeNodes(nodes: TreeNode<keyof HTMLElementTagNameMap> | null, options: RenderOptions) {
  const { handleClick, selectedNodeId } = options;

  if (!nodes) return null;

  return (
    <>
      <ActionMenu
        key={nodes.id}
        data-key={nodes.id}
        items={[
          { id: 'add', label: '添加', onClick: () => options.handleAdd(nodes.id) },
          { id: 'moveUp', label: '上移', onClick: () => options.handleMove(nodes.id, 'up') },
          { id: 'moveDown', label: '下移', onClick: () => options.handleMove(nodes.id, 'down') },
          { id: 'copy', label: '复制', onClick: () => options.handleCopy(nodes.id) },
          { id: 'delete', label: '删除', onClick: () => options.handleDelete(nodes.id), className: 'text-red-500' },
        ]}
      >
        <div key={nodes.id} data-key={nodes.id} className="flex flex-col flex-nowrap px-1 pb-0 w-fit" onClick={(ev) => handleClick(nodes.id, ev)}>
          <div className="info relative items-center flex flex-nowrap hover:bg-gray-200 rounded-md p-1 transition-all cursor-pointer">
            <div className="whitespace-nowrap flex-shrink-0 mr-2 text-gray-700 text-sm">{nodes.name || nodes.type}</div>
            <div className="whitespace-nowrap text-xs text-gray-400">[{nodes.id}]</div>
            {selectedNodeId === nodes.id && (
              <div className="highlight absolute left-0 bottom-0 w-full h-[2px] bg-green-500"></div>
            )}
          </div>
          <div className="children pl-2">
            {nodes.children.map((node) => {
              return renderTreeNodes(node, options);
            })}
          </div>
        </div>
      </ActionMenu>
    </>
  )
}

type MoveCheckResult = {
  canMove: false;
  message: string;
} | {
  canMove: true;
  node: AnyNode;
}

// 节点移动的前置检查
function moveCheck(currentGroup: Group, id: string): MoveCheckResult {
  if (!currentGroup) {
    return { canMove: false, message: '当前分组为空' }
  }
  const nodeIndex = currentGroup.nodes.findIndex((node) => node.id === id);
  const node = currentGroup.nodes[nodeIndex];
  if (!node) {
    return { canMove: false, message: '节点不存在' }
  }
  if (!node.parentId) {
    return { canMove: false, message: '无法移动根节点' }
  }
  return { canMove: true, node }
}

const Minimap = memo(() => {
  const { setSelectedNodeId, selectedNodeId, nestedNode, currentGroup } = useContext(LowCodeContext);
  const setGroup = useLowCodeStore(state => state.setGroup);
  const { toast } = useToast();

  // 选中节点
  const handleClick = useCallback((id: string, ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    ev.stopPropagation();
    setSelectedNodeId(id);
  }, [setSelectedNodeId])

  // 复制节点
  // TODO: 复制到指定父节点下
  const handleCopy = useCallback((id: string) => {
    if (!currentGroup) return;
    const node = currentGroup.nodes.find((node) => node.id === id);
    if (!node?.parentId) {
      toast({ title: '无法复制根节点' })
      return;
    }
    const newGroup = produce(currentGroup, (draft) => {
      const nodes = draft.nodes || [];
      const index = nodes.findIndex((node) => node.id === id);
      const node = nodes[index];
      const parentNode = draft.nodes.find((item) => item.id === node.parentId)!;

      // 平铺节点加入新节点，父节点也要添加 childrenIds
      if (index !== -1) {
        const newNode = cloneDeep(node);
        newNode.id = randomUUID();
        newNode.childrenIds = [];
        parentNode.childrenIds.push(newNode.id);
        nodes.push(newNode);
      }
    });
    setGroup(newGroup.id, newGroup)
  }, [currentGroup, setGroup, toast])

  // 删除节点
  const handleDelete = useCallback((id: string) => {
    if (!currentGroup) return;
    const node = currentGroup.nodes.find((node) => node.id === id);
    if (!node?.parentId) {
      toast({ title: '无法删除根节点' })
      return;
    }

    dialog.confirm('确定删除该节点？').then(flag => {
      if (!flag) {
        return
      }
      const newGroup = produce(currentGroup, (draft) => {
        const nodes = draft.nodes
        const index = nodes.findIndex((child) => child.id === id);
        const node = nodes[index];
        const parentNode = draft.nodes.find((child) => child.id === node.parentId);
        if (!parentNode) {
          return draft;
        }

        // 除了删除平铺列表中的，还要处理父节点的 childrenIds
        // 节点 id 在 childrenIds 中的位置
        const childIndex = parentNode.childrenIds.findIndex((childId) => id === childId);
        if (childIndex !== -1) {
          parentNode.childrenIds.splice(childIndex, 1);
        }
        if (index !== -1) {
          nodes.splice(index, 1);
        }
      });
      setGroup(newGroup.id, newGroup)
    })
  }, [currentGroup, setGroup, toast])

  // 节点移动
  const handleMove = useCallback((id: string, direction: 'up' | 'down') => {
    if (!currentGroup) return;
    const checkResult = moveCheck(currentGroup, id);
    if (!checkResult.canMove) {
      toast({ title: checkResult.message })
      return
    }
    const node = checkResult.node;
    // 先找到一个节点 A 的父节点，然后找到父节点的 childrenIds，从这里面得到节点 A 的位置
    const parentIndex = currentGroup.nodes.findIndex((item) => item.id === node.parentId);
    const parentNode = currentGroup.nodes[parentIndex]
    // 节点当前的下标（在父节点中的）
    const currentIndex = parentNode.childrenIds.findIndex((childId) => id === childId);

    if (direction === 'up' && currentIndex === 0) {
      toast({ title: '上移失败' })
      return;
    }
    if (direction === 'down' && currentIndex === parentNode.childrenIds.length - 1) {
      toast({ title: '下移失败' })
      return;
    }
    // 移动后的下标
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    // 改变平铺列表中，指定父节点中 childrenIds 的顺序
    const newGroup = produce(currentGroup, (draft) => {
      const nodes = draft.nodes || [];
      const parent = nodes[parentIndex];
      parent.childrenIds.splice(currentIndex, 1)
      parent.childrenIds.splice(newIndex, 0, id)
    })
    setGroup(newGroup.id, newGroup)
  }, [currentGroup, setGroup, toast])

  // 添加节点
  const handleAdd = useCallback((id: string) => {
    if (!currentGroup) return;
    const index = currentGroup.nodes.findIndex((node) => node.id === id);
    if (index === -1) return;
    const node = currentGroup.nodes[index];
    const newNode = createNode(randomUUID(), node.id);
    // 往平铺列表中添加节点，往当前节点的 childrenIds 添加子节点
    const newGroup = cloneDeep(currentGroup);
    newGroup.nodes = [...newGroup.nodes, newNode];
    // 要修改节点的 childrenIds
    setGroup(newGroup.id, produce(newGroup, (draft) => {
      const node = draft.nodes[index];
      node.childrenIds.push(newNode.id);
    }))
  }, [currentGroup, setGroup])

  if (!nestedNode) return null;

  return (
    <div className="absolute left-2 top-2 max-w-44 w-fit h-max-80 bg-[#f3f4f6] bg-opacity-80 rounded-xl shadow-[0_0_8px_0px_rgba(0,0,0,0.25)] backdrop-blur overflow-auto">
      <div className="flex flex-nowrap px-1 py-1 pb-0 w-fit text-sm" onClick={() => setSelectedNodeId('')}>
        <div className="info relative items-center flex flex-nowrap hover:bg-gray-200 rounded-md p-1 transition-all cursor-pointer">
          选择分组
        </div>
      </div>
      {renderTreeNodes(nestedNode, {
        handleClick,
        selectedNodeId,
        handleCopy,
        handleDelete,
        handleMove,
        handleAdd,
      })}
    </div>
  );
});

export default Minimap;
