import { TreeNode } from '@/store/lowcode/type';
import { memo, useCallback, useContext } from 'react';
import { LowCodeContext } from '../../context/LowCodeContext/context';

interface RenderOptions {
  handleClick: (id: string) => void;
  selectedNodeId: string;
}

function renderTreeNodes(nodes: TreeNode<keyof HTMLElementTagNameMap> | null, options: RenderOptions) {
  const { handleClick, selectedNodeId } = options;

  if (!nodes) return null;

  return (
    <>
      <div key={nodes.id} className="flex flex-col flex-nowrap px-1 pb-0 w-fit" onClick={() => handleClick(nodes.id)}>
        <div className="info relative items-center flex flex-nowrap hover:bg-gray-200 rounded-md p-1 transition-all cursor-pointer">
          <div className="whitespace-nowrap flex-shrink-0 mr-2 text-gray-700 text-sm">{nodes.type}</div>
          <div className="whitespace-nowrap text-xs text-gray-400">[{nodes.id}]</div>
          {selectedNodeId === nodes.id && (
            <div className="highlight absolute left-0 bottom-0 w-full h-[2px] bg-green-500"></div>
          )}
        </div>
        <div className="children pl-2">
          {nodes.children.map((node) => {
            return renderTreeNodes(node, options);
          })}
        </div>
      </div>
    </>
  )
}

const Minimap = memo(() => {
  const { setSelectedNodeId, selectedNodeId, nestedNode } = useContext(LowCodeContext);

  const handleClick = useCallback((id: string) => {
    setSelectedNodeId(id);
  }, [setSelectedNodeId])

  if (!nestedNode) return null;

  return (
    <div className="absolute left-2 top-2 max-w-44 w-fit h-max-80 bg-[#f3f4f6] bg-opacity-80 rounded-xl shadow-[0_0_8px_0px_rgba(0,0,0,0.25)] backdrop-blur overflow-auto">
      <div className="flex flex-nowrap px-1 py-1 pb-0 w-fit text-sm" onClick={() => setSelectedNodeId('')}>
        <div className="info relative items-center flex flex-nowrap hover:bg-gray-200 rounded-md p-1 transition-all cursor-pointer">
          选择分组
        </div>
      </div>
      {renderTreeNodes(nestedNode, {
        handleClick,
        selectedNodeId
      })}
    </div>
  );
});

export default Minimap;
