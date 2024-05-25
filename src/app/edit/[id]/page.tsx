import { Button } from '@/components/ui/button';
import { GearIcon } from '@radix-ui/react-icons';

// 获取数据，预生成指定静态页面的，用作 SEO
export async function generateStaticParams() {
  return [
    { id: '1' }
  ]
}

export default function Edit() {
  return (
    <div className="w-full h-full flex flex-col">
      <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4">
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
    </div>
  );
}
