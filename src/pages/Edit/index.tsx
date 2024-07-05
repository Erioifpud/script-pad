import { memo } from 'react';
import ScriptList from './components/ScriptList';
import EditPanel from './components/EditPanel';
import { TransitionDiv } from '@/components/transition';

const EditPage = memo(() => {
  return (
    <TransitionDiv
      className="relative w-full h-full overflow-hidden flex flex-grow"
    >
      <ScriptList></ScriptList>
      <div className="flex-grow h-full overflow-hidden">
        <EditPanel></EditPanel>
      </div>
    </TransitionDiv>
  )
})

export default EditPage;