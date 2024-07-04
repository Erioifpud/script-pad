import { memo, useCallback, useContext, useState } from 'react';
import DynamicComp from './DynamicComp';
import Minimap from './Minimap';
import { LowCodeContext } from '../../context/LowCodeContext/context';
import { Button } from '@/components/ui/button';

const PreviewContainer = memo(() => {
  const { currentGroup, nestedNode } = useContext(LowCodeContext);

  const [scale, setScale] = useState(1);

  const handleScaleChange = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (!e.ctrlKey) {
      return;
    }
    const delta = e.deltaY;
    const newScale = scale + delta / 1000;
    if (newScale > 0.1 && newScale < 10) {
      setScale(newScale);
    }
  }, [scale]);

  return (
    <div
      className="relative flex justify-center items-center w-full h-full overflow-hidden select-none"
      style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(219, 219, 219,0.2) 0px, rgba(219, 219, 219,0.2) 1px,transparent 1px, transparent 21px),repeating-linear-gradient(90deg, rgba(219, 219, 219,0.2) 0px, rgba(219, 219, 219,0.2) 1px,transparent 1px, transparent 21px),linear-gradient(90deg, rgb(255,255,255),rgb(255,255,255))'
      }}
      onWheel={handleScaleChange}
    >
      <div
        style={{
          transform: `scale(${scale})`,
        }}
      >
        <DynamicComp nestedNode={nestedNode} mockData={currentGroup?.mockData || {}} />
      </div>
      <Minimap />
      {/* 还原缩放 */}
      {scale !== 1 && (
        <div className="reset absolute right-2 bottom-2">
          <Button onClick={() => setScale(1)} variant="destructive" size="sm">还原</Button>
        </div>
      )}
    </div>
  );
});

export default PreviewContainer;
