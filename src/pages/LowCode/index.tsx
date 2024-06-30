import { memo } from 'react';
import GroupList from './components/GroupList';
import PreviewContainer from './components/Preview/Container';
import ToolPanel from './components/ToolPanel';
import LowCodeProvider from './context/LowCodeContext';

const LowCodePage = memo(() => {
  return (
    <LowCodeProvider>
      <div className="flex flex-grow h-full">
        <GroupList></GroupList>
        <div className="flex-grow h-full overflow-hidden">
          <PreviewContainer />
        </div>
        <ToolPanel />
      </div>
    </LowCodeProvider>
  );
});

export default LowCodePage;