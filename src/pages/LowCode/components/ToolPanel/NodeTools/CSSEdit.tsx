import { LowCodeContext } from '@/pages/LowCode/context/LowCodeContext/context';
import { useLowCodeStore } from '@/store/lowcode';
import { produce } from 'immer';
import { memo, useCallback, useContext } from 'react';
import MonacoCSSWrapper from './MonacoCSSWrapper';

const CSSEdit = memo(() => {
  const { currentNode, currentGroup } = useContext(LowCodeContext);
  const setGroupNodes = useLowCodeStore((state) => state.setGroupNodes);

  // 编辑 css，保存回节点
  const handleChange = useCallback(
    (data: string) => {
      if (!currentGroup) {
        return;
      }
      const nodes = currentGroup?.nodes || []

      setGroupNodes(currentGroup.id, produce(nodes, draft => {
        const node = draft.find((item) => item.id === currentNode?.id);
        if (node) {
          node.css = data;
        }
      }));
    },
    [currentGroup, currentNode?.id, setGroupNodes]
  );

  return (
    <div className="relative mt-4">
      <div className="px-1">
        <div className="item mb-4">
          <div className="label mb-2 text-sm">CSS 编辑</div>
          <div className="value bg-white">
            <MonacoCSSWrapper data={currentNode?.css || ':root {}'} onChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default CSSEdit;
