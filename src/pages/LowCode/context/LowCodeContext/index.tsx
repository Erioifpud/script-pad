import { memo, useEffect, useMemo, useState } from 'react';
import { LowCodeContext } from './context';
import { useCurrentGroup } from '../../hooks/useCurrentGroup';
import useConvertToNestedNodes from '../../hooks/useFullNode';

interface Props {
  children: React.ReactNode;
}

const LowCodeProvider = memo((props: Props) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');

  const currentGroup = useCurrentGroup();
  const nestedNode = useConvertToNestedNodes(currentGroup?.nodes || []);

  // 当前选中的节点
  const currentNode = useMemo(() => {
    if (!currentGroup) return null;
    const nodes = currentGroup.nodes
    return nodes.find(node => node.id === selectedNodeId) || null
  }, [currentGroup, selectedNodeId]);

  // 切换分组时，清空选中节点
  useEffect(() => {
    setSelectedNodeId('');
  }, [currentGroup]);

  return (
    <LowCodeContext.Provider value={{
      selectedNodeId,
      setSelectedNodeId,
      currentGroup,
      nestedNode,
      currentNode,
    }}>
      {props.children}
    </LowCodeContext.Provider>
  )
});

export default LowCodeProvider;