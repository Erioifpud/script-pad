import { memo } from 'react';
import BasicInfo from './BasicInfo';
import AttributeEdit from './AttributeEdit';
import StyleEdit from './StyleEdit';

const NodeTools = memo(() => {
  return (
    <div className="node-tools relative w-full h-full overflow-auto p-2 pt-4">
      <BasicInfo />
      <div className="border-b border-solid border-gray-300"></div>
      <StyleEdit />
      <div className="border-b border-solid border-gray-300"></div>
      <AttributeEdit />
    </div>
  );
});

export default NodeTools;
