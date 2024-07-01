import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LowCodeContext } from '@/pages/LowCode/context/LowCodeContext/context';
import { useLowCodeStore } from '@/store/lowcode';
import { produce } from 'immer';
import { memo, useCallback, useContext } from 'react';

// 常见的就行
const tagNameOptions: { label: string, value: keyof HTMLElementTagNameMap }[] = [
  { label: 'div', value: 'div' },
  { label: 'img', value: 'img' },
  { label: 'span', value: 'span' },
  { label: 'p', value: 'p' },
  { label: 'h1', value: 'h1' },
]

const BasicInfo = memo(() => {
  const { currentNode, currentGroup } = useContext(LowCodeContext);
  const setGroup = useLowCodeStore(state => state.setGroup);

  const handleTypeChange = useCallback((value: keyof HTMLElementTagNameMap) => {
    if (!currentGroup || !currentNode) return;
    const newGroup = produce(currentGroup, draft => {
      const nodes = draft.nodes
      const node = nodes.find(node => node.id === currentNode?.id)
      if (node) {
        node.type = value
      }
    })
    setGroup(newGroup.id, newGroup)
  }, [currentGroup, currentNode, setGroup])

  return (
    <div className="relative">
      <div className="px-1">
        <div className="item mb-4">
          <div className="label mb-2 text-sm">节点类型</div>
          <div className="value bg-white">
            <Select onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={currentNode?.type} />
              </SelectTrigger>
              <SelectContent>
                {tagNameOptions.map(option => {
                  return <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
});

export default BasicInfo;
