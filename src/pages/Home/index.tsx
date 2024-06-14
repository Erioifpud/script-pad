import AppIcon from '@/components/AppIcon';
import { useAppStore } from '@/store/app';
import { memo, useMemo } from 'react';

const HomePage = memo(() => {
  const scripts = useAppStore(state => state.scripts);

  const pinnedScripts = useMemo(() => {
    return scripts.filter(script => script.pinned);
  }, [scripts]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="p-4 grid relative w-full h-full overflow-y-auto gap-4 grid-cols-5 grid-flow-dense grid-rows-[auto_1fr] bg-white">
        {!pinnedScripts.length && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-800 select-none">暂无脚本</div>}
        {pinnedScripts.map(script => {
          return (
            <div className="aspect-square rounded-2xl flex flex-col justify-center items-center overflow-hidden select-none cursor-pointer">
              <AppIcon name={script.title} />
              <div className="mt-2 text-sm font-bold max-w-full truncate px-8">{script.title}</div>
            </div>
          )
        })}
      </div>
    </div>
  );
})


export default HomePage;