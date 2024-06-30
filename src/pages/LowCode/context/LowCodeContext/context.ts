import { AnyNode, Group, TreeNode } from '@/store/lowcode/type';
import { createContext } from 'react';

export type LowCodeContextType = {
  selectedNodeId: string;
  setSelectedNodeId: (id: string) => void;
  currentGroup: Group | null,
  nestedNode: TreeNode<keyof HTMLElementTagNameMap> | null,
  currentNode: AnyNode | null,
}

export const LowCodeContext = createContext<LowCodeContextType>({
  selectedNodeId: '',
  setSelectedNodeId: () => {},
  currentGroup: null,
  nestedNode: null,
  currentNode: null,
})
