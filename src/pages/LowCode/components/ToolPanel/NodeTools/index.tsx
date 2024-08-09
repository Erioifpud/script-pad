import { Fragment, memo, useContext } from 'react';
import BasicInfo from '../components/BasicInfo';
import AttributeEdit from '../components/AttributeEdit';
import StyleEdit from '../components/StyleEdit';
import CSSEdit from '../components/CSSEdit';
import ConditionEdit from '../components/ConditionEdit';
import { LowCodeContext } from '@/pages/LowCode/context/LowCodeContext/context';
import { MacScrollbar } from 'mac-scrollbar';

const NodeTools = memo(() => {
  const { currentNode } = useContext(LowCodeContext);

  return (
    <MacScrollbar className="node-tools relative w-full h-full overflow-auto p-2 pt-4">
      <BasicInfo />
      <div className="border-b border-solid border-gray-300"></div>
      <StyleEdit />
      {currentNode?.parentId && (
        <Fragment>
          <div className="border-b border-solid border-gray-300"></div>
          <ConditionEdit />
        </Fragment>
      )}
      <div className="border-b border-solid border-gray-300"></div>
      <AttributeEdit />
      <div className="border-b border-solid border-gray-300"></div>
      <CSSEdit />
    </MacScrollbar>
  );
});

export default NodeTools;
