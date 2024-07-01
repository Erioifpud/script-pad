import RecordEdit from '@/pages/Edit/components/RecordEdit';
import { LowCodeContext } from '@/pages/LowCode/context/LowCodeContext/context';
import { useLowCodeStore } from '@/store/lowcode';
import { produce } from 'immer';
import { memo, useCallback, useContext, useMemo } from 'react';

const AttributeEdit = memo(() => {
  const { currentNode, currentGroup } = useContext(LowCodeContext);
  const setGroupNodes = useLowCodeStore((state) => state.setGroupNodes);

  // 将当前节点的 attr 转换成 Record<string, string>
  const attrObj = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const acc: Record<string, any> = {};
    const attr = currentNode?.attrs || {}
    Object.keys(attr).forEach((key) => {
      // @ts-expect-error 全部转换为 json 吧，这里不会放过于复杂的值
      acc[key] = attr[key];
    });
    return acc;
  }, [currentNode]);

  // 编辑 attr，保存回节点
  const handleChange = useCallback(
    (data: Record<string, string>) => {
      if (!currentGroup) {
        return;
      }
      const nodes = currentGroup?.nodes || []

      setGroupNodes(currentGroup.id, produce(nodes, draft => {
        const node = draft.find((item) => item.id === currentNode?.id);
        if (node) {
          node.attrs = data;
        }
      }));
    },
    [currentGroup, currentNode?.id, setGroupNodes]
  );

  return (
    <div className="relative mt-4">
      <div className="px-1">
        <div className="item mb-4">
          <div className="label mb-2 text-sm">属性编辑</div>
          <div className="value bg-white">
            <RecordEdit data={attrObj} onChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default AttributeEdit;
