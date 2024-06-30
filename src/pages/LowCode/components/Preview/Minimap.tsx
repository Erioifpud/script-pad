import { TreeNode } from '@/store/lowcode/type';
import { memo, useCallback, useContext } from 'react';
import { LowCodeContext } from '../../context/LowCodeContext/context';

interface Props {
  nestedNode: TreeNode<keyof HTMLElementTagNameMap> | null;
}

function renderTreeNodes(nodes: TreeNode<keyof HTMLElementTagNameMap> | null, handleClick: (id: string) => void) {
  if (!nodes) return null;

  return (
    <>
      <div key={nodes.id} className="flex flex-col flex-nowrap px-1 py-2 w-fit" onClick={() => handleClick(nodes.id)}>
        <div className="info items-center flex flex-nowrap hover:bg-gray-200 rounded-md p-1 transition-all cursor-pointer">
          <div className="whitespace-nowrap flex-shrink-0 mr-2 text-gray-700 text-sm">{nodes.type}</div>
          <div className="whitespace-nowrap text-xs text-gray-400">[{nodes.id}]</div>
        </div>
        <div className="children pl-2">
          {nodes.children.map((node) => {
            return renderTreeNodes(node, handleClick);
          })}
        </div>
      </div>
    </>
  )
}

const Minimap = memo((props: Props) => {
  const { nestedNode } = props;
  const { setSelectedNodeId } = useContext(LowCodeContext);

  const handleClick = useCallback((id: string) => {
    setSelectedNodeId(id);
  }, [setSelectedNodeId])

  if (!nestedNode) return null;

  return (
    <div className="absolute left-2 top-2 w-44 h-max-80 bg-[#f3f4f6] bg-opacity-80 rounded-xl shadow-[0_0_8px_0px_rgba(0,0,0,0.25)] backdrop-blur overflow-auto">
      {renderTreeNodes(nestedNode, handleClick)}
    </div>
  );
});

export default Minimap;
