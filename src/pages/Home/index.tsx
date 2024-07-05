import AppIcon from '@/components/AppIcon';
import { Script, useAppStore } from '@/store/app';
import { TransitionDiv } from '@/components/transition';
import { executeScript } from '@/vm';
import { memo, useCallback, useMemo } from 'react';

const HomePage = memo(() => {
  const scripts = useAppStore(state => state.scripts);

  const pinnedScripts = useMemo(() => {
    return scripts.filter(script => script.pinned);
  }, [scripts]);

  const handleExecute = useCallback((script: Script) => {
    executeScript(script.code, script.globalVars);
  }, [])

  return (
    <TransitionDiv
      className="relative w-full h-full overflow-hidden"
    >
      <div
        className="p-4 grid relative w-full h-full overflow-y-auto gap-4 grid-cols-5 grid-flow-dense grid-rows-[auto_1fr]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(219, 219, 219,0.2) 0px, rgba(219, 219, 219,0.2) 1px,transparent 1px, transparent 21px),repeating-linear-gradient(90deg, rgba(219, 219, 219,0.2) 0px, rgba(219, 219, 219,0.2) 1px,transparent 1px, transparent 21px),linear-gradient(90deg, rgb(255,255,255),rgb(255,255,255))'
        }}
      >
        {!pinnedScripts.length && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-800 select-none">暂无脚本</div>}
        {pinnedScripts.map(script => {
          return (
            <div className="aspect-square rounded-2xl flex flex-col justify-center items-center overflow-hidden select-none" key={script.id}>
              <AppIcon
                name={script.title}
                className="transition-transform hover:scale-105"
                onClick={() => handleExecute(script)}
              />
              <div className="mt-2 text-sm font-bold max-w-full truncate px-8">{script.title}</div>
            </div>
          )
        })}
      </div>
    </TransitionDiv>
  );
})


export default HomePage;