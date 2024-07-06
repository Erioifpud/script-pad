import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Doc, useDocStore } from '@/store/doc';
import { Settings2Icon } from 'lucide-react';
import { memo } from 'react';

interface Props {
  doc: Doc
}

const SettingButton = memo((props: Props) => {
  const { doc } = props
  const editDoc = useDocStore(state => state.editDoc)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto gap-1.5 text-sm flex-shrink-0"
        >
          <Settings2Icon className="size-3.5" />
          设置
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑记事本信息</DialogTitle>
          <DialogDescription>
            修改会直接保存
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              名称
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={doc.title}
              onChange={(e) => editDoc(doc.id, { title: e.target.value })}
            />
          </div>
        </div>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
})

SettingButton.displayName = 'SettingButton'

export default SettingButton