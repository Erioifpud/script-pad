import { memo } from 'react';
import BasicInfo from './BasicInfo';

const NodeTools = memo(() => {
  return (
    <div className="node-tools relative w-full h-full overflow-auto p-2 pt-4">
      <BasicInfo />
    </div>
  );
});

export default NodeTools;
