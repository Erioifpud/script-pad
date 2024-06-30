import { memo, useMemo } from 'react';
import { renderTreeNodeFn } from './renderTreeNodes';
import { TreeNode } from '@/store/lowcode/type';

interface Props {
  nestedNode: TreeNode<keyof HTMLElementTagNameMap> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockData: Record<string, any>;
}

const DynamicComp = memo((props: Props) => {
  const { nestedNode, mockData } = props;

  const h = useMemo(() => {
    if (!nestedNode) return () => <div>No Group</div>;
    return renderTreeNodeFn(nestedNode);
  }, [nestedNode])

  return h(mockData)
});

export default DynamicComp;
