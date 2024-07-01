import { Node, TreeNode } from '@/store/lowcode/type';
import { useState, useEffect } from 'react';

// 将平铺的 nodes 转换成树形结构
function useConvertToNestedNodes<T extends keyof HTMLElementTagNameMap>(
  flatNodes: Node<T>[]
): TreeNode<T> | null {
  const [rootNode, setRootNode] = useState<TreeNode<T> | null>(null);

  useEffect(() => {
    if (flatNodes.length === 0) {
      setRootNode(null);
      return;
    }

    const nodeMap: Record<string, TreeNode<T>> = {};

    // 预处理，构建节点映射表
    flatNodes.forEach(node => {
      nodeMap[node.id] = { ...node, children: [] };
    });

    // 找到根节点
    const rootNodeId = flatNodes.find(node => !node.parentId)?.id;
    if (!rootNodeId) {
      setRootNode(null);
      return;
    }

    // 重写构建嵌套结构逻辑，根据 childrenIds 排序
    const buildTree = (parentId: string) => {
      const parentNode = nodeMap[parentId];
      if (parentNode.childrenIds) {
        parentNode.childrenIds.forEach(childId => {
          const childNode = nodeMap[childId];
          if (childNode) {
            parentNode.children.push(childNode);
            buildTree(childId); // 递归构建子树
          }
        });
      }
    };

    buildTree(rootNodeId);
    setRootNode(nodeMap[rootNodeId]);
  }, [flatNodes]);

  return rootNode;
}

export default useConvertToNestedNodes;