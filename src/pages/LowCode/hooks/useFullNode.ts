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
    const rootNodeId = Object.keys(nodeMap).find(id => !nodeMap[id].parentId);
    if (!rootNodeId) {
      setRootNode(null);
      return;
    }

    // 构建嵌套结构
    flatNodes.forEach(node => {
      if (node.parentId && nodeMap[node.parentId]) {
        nodeMap[node.parentId].children.push(nodeMap[node.id]);
        // 如果value不为空，移到children的第一个位置
        if (node.value) {
          const valueNode = nodeMap[node.id];
          const siblings = nodeMap[node.parentId].children;
          const index = siblings.indexOf(valueNode);
          if (index > -1) {
            siblings.splice(index, 1); // 移除原位置的节点
            siblings.unshift(valueNode); // 插入到首位
          }
        }
      }
    });

    setRootNode(nodeMap[rootNodeId]);
  }, [flatNodes]);

  return rootNode;
}

export default useConvertToNestedNodes;