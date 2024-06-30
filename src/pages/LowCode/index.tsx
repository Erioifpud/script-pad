import { memo } from 'react';
import GroupList from './components/GroupList';
import PreviewContainer from './components/Preview/Container';
import ToolPanel from './components/ToolPanel';

const LowCodePage = memo(() => {
  return (
    <div className="flex flex-grow h-full">
      <GroupList></GroupList>
      <div className="flex-grow h-full overflow-hidden">
        <PreviewContainer />
      </div>
      <ToolPanel />
    </div>
  );
});

export default LowCodePage;