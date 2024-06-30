import { memo, useContext, useMemo } from 'react';
import { LowCodeContext } from '../../context/LowCodeContext/context';
import NodeTools from './NodeTools';

const ToolPanel = memo(() => {
  const { currentNode } = useContext(LowCodeContext);

  // 当前选中了节点，就显示节点面板
  const isNodeMode = useMemo(() => {
    return !!currentNode;
  }, [currentNode]);

  return (
    <div className="relative bg-gray-100 border-l border-solid border-gray-200 w-72 overflow-hidden select-none">
      {isNodeMode ? (
        <NodeTools />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">Group 面板</div>
      )}
    </div>
  )
})

export default ToolPanel
