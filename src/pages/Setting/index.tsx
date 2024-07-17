import { memo } from 'react';
import { TransitionDiv } from '@/components/transition';
import FormContainer from './components/FormContainer';

const SettingPage = memo(() => {
  return (
    <TransitionDiv className="relative w-full h-full overflow-hidden">
      <FormContainer></FormContainer>
    </TransitionDiv>
  )
})

export default SettingPage;
