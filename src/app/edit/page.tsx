'use client';
import EditPanel from './_components/EditorPanel';
import { useCurrentScript } from './_hooks/useCurrentScript';

export default function EditPage() {
  const currentScript = useCurrentScript();

  if (!currentScript) {
    return <div className="w-full h-full flex justify-center items-center">请在左侧选择脚本</div>
  }

  return (
    <EditPanel></EditPanel>
  )
}
