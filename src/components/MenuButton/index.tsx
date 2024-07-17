import { memo, useCallback } from 'react';
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EllipsisIcon } from 'lucide-react';
import { useSettingStore } from '@/store/setting';
import { dialog, fs, path } from '@tauri-apps/api';
import { FormDefaultValueMap } from '@/store/setting/rule';
import JSZip from 'jszip';
import { FileEntry } from '@tauri-apps/api/fs';
import { useToast } from '../ui/use-toast';
import { formatTime } from '@/utils/date';

interface FormItem extends FileEntry {
  buffer: Uint8Array
}

async function getSaveFiles(path: string) {
  const entries = await fs.readDir(path)
  const fileInfos: FormItem[] = []
  for (const entry of entries) {
    if (typeof entry.name !== 'string' || !entry.name.endsWith('.dat')) {
      continue
    }
    const buffer = await fs.readBinaryFile(entry.path)
    fileInfos.push({
      ...entry,
      buffer
    })
  }
  return fileInfos
}

async function backupSaves(settings: FormDefaultValueMap) {
  let backupPath = settings['backupDir'] as string
  // 降级操作，如果没设置备份路径，那就弹窗手选
  if (!backupPath) {
    const selectPath = await dialog.open({
      multiple: false,
      directory: true,
    }) as string | null
    if (!selectPath) {
      return
    }
    backupPath = selectPath
  }
  const dataPath = await path.appDataDir();
  const zip = new JSZip()
  const fileInfos = await getSaveFiles(dataPath)
  fileInfos.forEach((fileInfo) => {
    zip.file(fileInfo.name!, fileInfo.buffer, { binary: true })
  })
  const zipData = await zip.generateAsync({ type: 'uint8array' })
  const name = `[BACKUP]ScriptPad-${formatTime(+new Date(), 'yyyyMMdd-HHmmss')}.zip`
  const fullPath = await path.join(backupPath, name)
  return fs.writeBinaryFile(fullPath, zipData)
}

const MenuButton = memo(() => {
  const settings = useSettingStore(state => state.settings)
  const { toast } = useToast()

  // 备份数据
  const handleBackup = useCallback(async () => {
    await backupSaves(settings)
    toast({
      title: '备份完成',
    })
  }, [settings, toast])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>数据</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleBackup}>
          备份
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

export default MenuButton
