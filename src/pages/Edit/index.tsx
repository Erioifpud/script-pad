import { memo } from 'react';
import ScriptList from './components/ScriptList';
import EditPanel from './components/EditPanel';

const EditPage = memo(() => {
  return (
    <div className="flex flex-grow h-full">
      <ScriptList></ScriptList>
      <div className="flex-grow h-full overflow-hidden">
        <EditPanel></EditPanel>
      </div>
    </div>
  )
})

export default EditPage;