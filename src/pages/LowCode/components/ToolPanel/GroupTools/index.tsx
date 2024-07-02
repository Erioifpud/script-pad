import { memo } from 'react';
import GroupInfo from '../components/GroupInfo';
import MockDataEdit from '../components/MockDataEdit';

const GroupTools = memo(() => {
  return (
    <div className="node-tools relative w-full h-full overflow-auto p-2 pt-4">
      <GroupInfo />
      <div className="border-b border-solid border-gray-300"></div>
      <MockDataEdit />
    </div>
  );
});

export default GroupTools;