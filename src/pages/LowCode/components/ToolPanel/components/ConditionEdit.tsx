import { Input } from '@/components/ui/input';
import { LowCodeContext } from '@/pages/LowCode/context/LowCodeContext/context';
import { useLowCodeStore } from '@/store/lowcode';
import { produce } from 'immer';
import { ChangeEvent, memo, useCallback, useContext } from 'react';

const ConditionEdit = memo(() => {
  const { currentGroup, currentNode } = useContext(LowCodeContext);
  const setGroup = useLowCodeStore(state => state.setGroup);

  // 修改节点的 listBy 数据源
  const handleListByChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    if (!currentGroup || !currentNode) return;
    const newGroup = produce(currentGroup, draft => {
      const nodes = draft.nodes
      const node = nodes.find(node => node.id === currentNode?.id)
      if (node) {
        node.listBy = ev.target.value.trim()
      }
    })
    setGroup(newGroup.id, newGroup)
  }, [currentGroup, currentNode, setGroup])

  // 修改节点的 removeBy 数据源
  const handleRemoveByChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    if (!currentGroup || !currentNode) return;
    const newGroup = produce(currentGroup, draft => {
      const nodes = draft.nodes
      const node = nodes.find(node => node.id === currentNode?.id)
      if (node) {
        node.removeBy = ev.target.value.trim()
      }
    })
    setGroup(newGroup.id, newGroup)
  }, [currentGroup, currentNode, setGroup])

  return (
    <div className="relative mt-4">
      <div className="px-1">
        <div className="item mb-4">
          <div className="label mb-2 text-sm">列表数据源</div>
          <div className="value bg-white">
            <Input
              type="text"
              placeholder="用该字段的数据列表渲染当前节点"
              value={currentNode?.listBy || ''}
              onChange={handleListByChange}
            />
          </div>
        </div>

        <div className="item mb-4">
          <div className="label mb-2 text-sm">隐藏数据源</div>
          <div className="value bg-white">
            <Input
              type="text"
              placeholder="用该字段的列表数据控制节点隐藏"
              value={currentNode?.removeBy || ''}
              onChange={handleRemoveByChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default ConditionEdit;
