import { memo, useContext } from 'react';
import DynamicComp from './DynamicComp';
import Minimap from './Minimap';
import { LowCodeContext } from '../../context/LowCodeContext/context';

const PreviewContainer = memo(() => {
  const { currentGroup, nestedNode } = useContext(LowCodeContext);

  return (
    <div
      className="relative flex justify-center items-center w-full h-full overflow-hidden select-none"
      style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(219, 219, 219,0.2) 0px, rgba(219, 219, 219,0.2) 1px,transparent 1px, transparent 21px),repeating-linear-gradient(90deg, rgba(219, 219, 219,0.2) 0px, rgba(219, 219, 219,0.2) 1px,transparent 1px, transparent 21px),linear-gradient(90deg, rgb(255,255,255),rgb(255,255,255))'
      }}
    >
      <DynamicComp nestedNode={nestedNode} mockData={currentGroup?.mockData || {}} />
      <Minimap />
    </div>
  );
});

export default PreviewContainer;
