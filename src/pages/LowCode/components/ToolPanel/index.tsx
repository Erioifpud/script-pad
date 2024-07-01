import { memo, useContext, useMemo } from 'react';
import { LowCodeContext } from '../../context/LowCodeContext/context';
import NodeTools from './NodeTools';
import GroupTools from './GroupTools';

enum Mode {
  Node = 'node',
  Group = 'group',
  None = 'none'
}

const ToolPanel = memo(() => {
  const { currentNode, currentGroup } = useContext(LowCodeContext);

  // 当前选中了节点，就显示节点面板
  const currentMode = useMemo(() => {
    if (currentNode) {
      return Mode.Node;
    } else if (currentGroup) {
      return Mode.Group;
    } else {
      return Mode.None;
    }
  }, [currentNode, currentGroup]);

  return (
    <div className="relative bg-gray-100 border-l border-solid border-gray-200 w-72 2xl:w-[428px] overflow-hidden select-none">
      {currentMode === Mode.Node && <NodeTools />}
      {currentMode === Mode.Group && <GroupTools />}
      {currentMode === Mode.None && (
        <div className="flex items-center justify-center h-full text-gray-400">请选择目标</div>
      )}
    </div>
  )
})

export default ToolPanel
