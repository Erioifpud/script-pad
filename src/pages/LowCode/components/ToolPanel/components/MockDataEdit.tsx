import { LowCodeContext } from '@/pages/LowCode/context/LowCodeContext/context';
import { useLowCodeStore } from '@/store/lowcode';
import { produce } from 'immer';
import { memo, useCallback, useContext } from 'react';
import MonacoJSONWrapper from './MonacoJSONWrapper';

const MockDataEdit = memo(() => {
  const { currentGroup } = useContext(LowCodeContext);
  const setGroup = useLowCodeStore((state) => state.setGroup);

  // 编辑 mockData，保存回 group
  const handleChange = useCallback(
    (data: Record<string, string>) => {
      if (!currentGroup) return;
      const newGroup = produce(currentGroup, draft => {
        draft.mockData = data;
      })
      setGroup(newGroup.id, newGroup)
    },
    [currentGroup, setGroup]
  );

  return (
    <div className="relative mt-4">
      <div className="px-1">
        <div className="item mb-4">
          <div className="label mb-2 text-sm">Mock Data</div>
          <div className="value bg-white">
            <MonacoJSONWrapper data={currentGroup?.mockData || {}} onChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default MockDataEdit;
