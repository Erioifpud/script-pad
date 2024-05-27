import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Script, useAppStore } from '@/store/app';
import { GearIcon } from '@radix-ui/react-icons';
import { memo } from 'react';
import RecordEdit from '../RecordEdit';

interface Props {
  script: Script
}

const SettingButton = memo((props: Props) => {
  const { script } = props
  const editScript = useAppStore(state => state.editScript)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto gap-1.5 text-sm flex-shrink-0"
        >
          <GearIcon className="size-3.5" />
          设置
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑脚本信息</DialogTitle>
          <DialogDescription>
            修改会直接保存（公共变量除外）
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
              value={script.title}
              onChange={(e) => editScript(script.id, { title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              描述
            </Label>
            <Input
              id="description"
              className="col-span-3"
              value={script.description}
              onChange={(e) => editScript(script.id, { description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              公共变量
            </Label>
            <RecordEdit
              data={script.globalVars}
              onChange={(e) => editScript(script.id, { globalVars: e }, false)}
            ></RecordEdit>
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