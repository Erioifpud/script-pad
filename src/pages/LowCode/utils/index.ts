import { Node, TreeNode } from '@/store/lowcode/type';

// 清理样式，移除名称和注释
export const cleanCSS = (css: string) => css
  .replace(/\s*:\s*root\s*\{/, '')
  .replace(/\s*}\s*/, '')
  .replace(/\/\/.*?\n|\/\*[\s\S]*?\*\//g, '')

// CSS 样式转换为对象
export const css2obj = (css: string) => {
  const r = /(?<=^|;)\s*([^:]+)\s*:\s*([^;]+)\s*/g;
  const o: Record<string, string> = {};
  css.replace(r, (_, p: string, v: string) => o[p] = v);
  return o;
};

// 将扁平的节点列表转换为嵌套结构
export function convertNestedNode<T extends keyof HTMLElementTagNameMap>(flatNodes: Node<T>[]) {
  if (flatNodes.length === 0) {
    return null;
  }

  const nodeMap: Record<string, TreeNode<T>> = {};

  // 预处理，构建节点映射表
  flatNodes.forEach(node => {
    nodeMap[node.id] = { ...node, children: [] };
  });

  // 找到根节点
  const rootNodeId = flatNodes.find(node => !node.parentId)?.id;
  if (!rootNodeId) {
    return null;
  }

  // 重写构建嵌套结构逻辑，根据 childrenIds 排序
  const buildTree = (parentId: string) => {
    const parentNode = nodeMap[parentId];
    if (parentNode.childrenIds) {
      parentNode.childrenIds.forEach((childId: string) => {
        const childNode = nodeMap[childId];
        if (childNode) {
          parentNode.children.push(childNode);
          buildTree(childId); // 递归构建子树
        }
      });
    }
  };

  buildTree(rootNodeId);
  return nodeMap[rootNodeId];
}