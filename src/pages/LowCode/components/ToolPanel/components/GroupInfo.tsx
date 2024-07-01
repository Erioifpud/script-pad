import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { LowCodeContext } from '@/pages/LowCode/context/LowCodeContext/context';
import { useLowCodeStore } from '@/store/lowcode';
import { produce } from 'immer';
import { ChangeEvent, memo, useCallback, useContext } from 'react';

const GroupInfo = memo(() => {
  const { currentGroup } = useContext(LowCodeContext);
  const setGroup = useLowCodeStore(state => state.setGroup);
  const { toast } = useToast()

  // 修改分组名称
  const handleNameChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    if (!currentGroup) return;
    const val = ev.target.value.trim();
    if (!val) {
      toast({
        title: '分组名称不能为空',
        variant: 'destructive'
      })
      return;
    }
    const newGroup = produce(currentGroup, draft => {
      draft.name = ev.target.value;
    })
    setGroup(newGroup.id, newGroup)
  }, [currentGroup, setGroup, toast])

  // 修改分组描述
  const handleDescChange = useCallback((ev: ChangeEvent<HTMLTextAreaElement>) => {
    if (!currentGroup) return;
    const newGroup = produce(currentGroup, draft => {
      draft.description = ev.target.value;
    })
    setGroup(newGroup.id, newGroup)
  }, [currentGroup, setGroup])

  return (
    <div className="relative">
      <div className="px-1">
        <div className="item mb-4">
          <div className="label mb-2 text-sm">分组名称</div>
          <div className="value bg-white">
            <Input
              type="text"
              placeholder="分组名称"
              value={currentGroup?.name || ''}
              onChange={handleNameChange}
            />
          </div>
        </div>

        <div className="item mb-4">
          <div className="label mb-2 text-sm">分组描述</div>
          <div className="value bg-white">
            <Textarea
              value={currentGroup?.description || ''}
              onChange={handleDescChange}
              rows={5}
              className="resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default GroupInfo;
