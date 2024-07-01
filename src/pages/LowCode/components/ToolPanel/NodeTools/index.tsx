import { memo } from 'react';
import BasicInfo from '../components/BasicInfo';
import AttributeEdit from '../components/AttributeEdit';
import StyleEdit from '../components/StyleEdit';
import CSSEdit from '../components/CSSEdit';

const NodeTools = memo(() => {
  return (
    <div className="node-tools relative w-full h-full overflow-auto p-2 pt-4">
      <BasicInfo />
      <div className="border-b border-solid border-gray-300"></div>
      <StyleEdit />
      <div className="border-b border-solid border-gray-300"></div>
      <AttributeEdit />
      <div className="border-b border-solid border-gray-300"></div>
      <CSSEdit />
    </div>
  );
});

export default NodeTools;
