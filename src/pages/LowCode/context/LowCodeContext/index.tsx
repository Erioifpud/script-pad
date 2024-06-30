import { memo, useEffect, useState } from 'react';
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
    }}>
      {props.children}
    </LowCodeContext.Provider>
  )
});

export default LowCodeProvider;