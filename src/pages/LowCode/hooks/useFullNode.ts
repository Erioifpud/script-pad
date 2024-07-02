import { Node, TreeNode } from '@/store/lowcode/type';
import { useState, useEffect } from 'react';
import { convertNestedNode } from '../utils';

// 将平铺的 nodes 转换成树形结构
function useConvertToNestedNodes<T extends keyof HTMLElementTagNameMap>(
  flatNodes: Node<T>[]
): TreeNode<T> | null {
  const [rootNode, setRootNode] = useState<TreeNode<T> | null>(null);

  useEffect(() => {
    const nested = convertNestedNode(flatNodes);
    setRootNode(nested);
  }, [flatNodes]);

  return rootNode;
}

export default useConvertToNestedNodes;