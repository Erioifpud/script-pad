import { memo } from 'react';
import GroupInfo from '../components/GroupInfo';
import MockDataEdit from '../components/MockDataEdit';
import GroupManage from '../components/GroupCapture';
import { MacScrollbar } from 'mac-scrollbar';

const GroupTools = memo(() => {
  return (
    <MacScrollbar className="node-tools relative w-full h-full overflow-auto p-2 pt-4">
      <GroupInfo />
      <div className="border-b border-solid border-gray-300"></div>
      <MockDataEdit />
      <div className="border-b border-solid border-gray-300"></div>
      <GroupManage />
    </MacScrollbar>
  );
});

export default GroupTools;
