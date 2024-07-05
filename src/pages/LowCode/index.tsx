import { memo } from 'react';
import GroupList from './components/GroupList';
import PreviewContainer from './components/Preview/Container';
import ToolPanel from './components/ToolPanel';
import LowCodeProvider from './context/LowCodeContext';
import { TransitionDiv } from '@/components/transition';

const LowCodePage = memo(() => {
  return (
    <LowCodeProvider>
      <TransitionDiv
        className="relative w-full h-full overflow-hidden flex flex-grow"
      >
        <GroupList></GroupList>
        <div className="flex-grow h-full overflow-hidden">
          <PreviewContainer />
        </div>
        <ToolPanel />
      </TransitionDiv>
    </LowCodeProvider>
  );
});

export default LowCodePage;