import { memo } from 'react';
import DocList from './components/DocList';
import EditPanel from './components/EditPanel';

const EditPage = memo(() => {
  return (
    <div className="flex flex-grow h-full">
      <DocList></DocList>
      <div className="flex-grow h-full overflow-hidden">
        <EditPanel></EditPanel>
      </div>
    </div>
  )
})

export default EditPage;