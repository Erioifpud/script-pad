import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function Home() {
  return (
    <div className="grid h-screen w-full pl-[53px]">
      <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
        <div className="border-b p-2">
          <Button variant="outline" size="icon" aria-label="Home">
            {/* <Triangle className="size-5 fill-foreground" /> */}
          </Button>
        </div>
        <nav className="grid gap-1 p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg bg-muted"
                aria-label="Playground"
              >
                1
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              1
            </TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </div>
  );
}
