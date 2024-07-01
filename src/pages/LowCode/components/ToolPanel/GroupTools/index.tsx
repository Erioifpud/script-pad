import { memo } from 'react';
import GroupInfo from '../components/GroupInfo';

const GroupTools = memo(() => {
  return (
    <div className="node-tools relative w-full h-full overflow-auto p-2 pt-4">
      <GroupInfo />
    </div>
  );
});

export default GroupTools;
