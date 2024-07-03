import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LowCodeContext } from '@/pages/LowCode/context/LowCodeContext/context';
import { useLowCodeStore } from '@/store/lowcode';
import { AnyNode } from '@/store/lowcode/type';
import { produce } from 'immer';
import { ChangeEvent, memo, useCallback, useContext } from 'react';

// 常见的就行
const tagNameOptions: { label: string, value: keyof HTMLElementTagNameMap }[] = [
  { label: 'div', value: 'div' },
  { label: 'img', value: 'img' },
  { label: 'span', value: 'span' },
  { label: 'p', value: 'p' },
  { label: 'h1', value: 'h1' },
]

function setNodeValue<U extends keyof AnyNode, T extends AnyNode[U]>(node: AnyNode, key: U, value: T) {
  node[key] = value
}

const BasicInfo = memo(() => {
  const { currentNode, currentGroup } = useContext(LowCodeContext);
  const setGroup = useLowCodeStore(state => state.setGroup);

  const handleChange = useCallback((value: AnyNode[keyof AnyNode], key: keyof AnyNode) => {
    if (!currentGroup || !currentNode) return;
    const newGroup = produce(currentGroup, draft => {
      const nodes = draft.nodes
      const node = nodes.find(node => node.id === currentNode?.id)
      if (node) {
        setNodeValue(node, key, value)
      }
    })
    setGroup(newGroup.id, newGroup)
  }, [currentGroup, currentNode, setGroup])

  // 修改节点类型
  const handleTypeChange = useCallback((value: keyof HTMLElementTagNameMap) => {
    handleChange(value, 'type')
  }, [handleChange])

  // 修改节点内容
  const handleValueChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    handleChange(ev.target.value, 'value')
  }, [handleChange])

  // 修改节点名称
  const handleNameChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    handleChange(ev.target.value, 'name')
  }, [handleChange])

  return (
    <div className="relative">
      <div className="px-1">
        <div className="item mb-4">
          <div className="label mb-2 text-sm">节点名称</div>
          <div className="value bg-white">
            <Input
              type="text"
              placeholder="节点名称"
              value={currentNode?.name || ''}
              onChange={handleNameChange}
            />
          </div>
        </div>

        <div className="item mb-4">
          <div className="label mb-2 text-sm">节点类型</div>
          <div className="value bg-white">
            <Select onValueChange={handleTypeChange} value={currentNode?.type}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tagNameOptions.map(option => {
                  return <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="item mb-4">
          <div className="label mb-2 text-sm">节点内容</div>
          <div className="value bg-white">
            <Input
              type="text"
              placeholder="元素的内容"
              value={currentNode?.value || ''}
              onChange={handleValueChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default BasicInfo;
