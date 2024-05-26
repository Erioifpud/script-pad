import { Button } from '@/components/ui/button';
import { GearIcon } from '@radix-ui/react-icons';
import Editor from './Editor';

export default function EditPanel() {
  return (
    <div className="relative w-full h-full flex flex-col">
      <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4 flex-shrink-0">
        <h1 className="text-xl font-semibold">
          草稿 1
        </h1>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto gap-1.5 text-sm"
        >
          <GearIcon className="size-3.5" />
          设置
        </Button>
      </header>
      <div className="relative flex-grow h-full overflow-hidden">
        <Editor></Editor>
      </div>
    </div>
  );
}
