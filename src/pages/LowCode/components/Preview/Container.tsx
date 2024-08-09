import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import DynamicComp from './DynamicComp';
import Minimap from './Minimap';
import { LowCodeContext } from '../../context/LowCodeContext/context';
import { Button } from '@/components/ui/button';
import Outline from './Outline';
import { Template } from '@/vm/modules/Template';
import ShadowWrapper from './ShadowWrapper';
import { Checkbox } from '@/components/ui/checkbox';

const PreviewContainer = memo(() => {
  const { currentGroup, nestedNode } = useContext(LowCodeContext);
  // 传入 outline 进行 querySelector 获取节点
  const containerRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  // 样式隔离预览模式，不会带有 css reset
  const [iframeMode, setIframeMode] = useState(false);
  const [htmlCode, setHtmlCode] = useState('');

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

  // 切换到隔离模式时生成 html 代码
  useEffect(() => {
    if (!currentGroup || !iframeMode) return
    new Template().renderToString(currentGroup.id, currentGroup.mockData).then(html => {
      setHtmlCode(html);
    });
    // eslint-disable-next-line
  }, [iframeMode, currentGroup]);

  return (
    <div
      className="relative flex justify-center items-center w-full h-full overflow-hidden select-none"
      style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(219, 219, 219,0.2) 0px, rgba(219, 219, 219,0.2) 1px,transparent 1px, transparent 21px),repeating-linear-gradient(90deg, rgba(219, 219, 219,0.2) 0px, rgba(219, 219, 219,0.2) 1px,transparent 1px, transparent 21px),linear-gradient(90deg, rgb(255,255,255),rgb(255,255,255))'
      }}
      onWheel={handleScaleChange}
    >
      <div
        ref={containerRef}
        className="relative"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        {iframeMode ? <ShadowWrapper code={htmlCode} /> : <DynamicComp nestedNode={nestedNode} mockData={currentGroup?.mockData || {}} />}
      </div>
      <Outline containerRef={containerRef} />
      <Minimap />
      {/* 还原缩放 */}
      {scale !== 1 && (
        <div className="reset absolute right-2 bottom-10">
          <Button onClick={() => setScale(1)} variant="destructive" size="sm">还原</Button>
        </div>
      )}
      {/* 预览模式切换 */}
      <div className="absolute right-2 bottom-2 flex items-center gap-1">
        <Checkbox
          id="modeCheck"
          checked={iframeMode}
          onCheckedChange={(checked: boolean) => setIframeMode(!!checked)}
        ></Checkbox>
        <label
          htmlFor="modeCheck"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          样式隔离预览
        </label>
      </div>
    </div>
  );
});

export default PreviewContainer;
