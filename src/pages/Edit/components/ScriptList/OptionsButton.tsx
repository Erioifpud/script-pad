import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/use-toast'
import { VERSION, useAppStore } from '@/store/app'
import { FileManager } from '@/vm/modules/File'
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import { dialog } from '@tauri-apps/api'
import { useCallback } from 'react'

// TODO: 在需要迁移前，保持 any[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const migrates: any[] = [
  // (old: ScriptV1) => new, 0 -> 1，如果读取的版本 n 和 VERSION 对不上，就从 index n 开始遍历执行
]

// 注意传入的是 data，带有 version 的
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migrateData(readData: any) {
  const dataVersion = readData.version
  let scripts = readData.scripts
  let i
  for (i = dataVersion; i < VERSION; i++) {
    const migrate = migrates[i]
    if (!migrate) continue
    scripts = migrate(scripts)
  }
  return {
    version: i,
    scripts
  }
}

export const OptionsButton = () => {
  const scripts = useAppStore(state => state.scripts)
  const setScripts = useAppStore(state => state.setScripts)

  const getExportData = useCallback(() => {
    const fullData = {
      version: VERSION,
      scripts
    }
    return JSON.stringify(fullData)
  }, [scripts])

  // 导出脚本
  const handleExport = useCallback(async () => {
    const path = await dialog.save({
      title: '导出脚本',
      defaultPath: 'scripts.json',
      filters: [
        {
          name: 'JSON',
          extensions: ['json']
        }
      ]
    })
    if (!path) return
    const data = getExportData()
    await FileManager.writeAsString(path, data)
    toast({
      title: '导出成功',
      description: `已导出到 ${path}`,
    })
  }, [getExportData])

  // 导入脚本
  const handleImport = useCallback(async() => {
    const path = await dialog.open({
      title: '导入脚本',
      directory: false,
      multiple: false,
      filters: [
        {
          name: 'JSON',
          extensions: ['json']
        }
      ]
    }) as string
    if (!path) return
    const data = await FileManager.readAsString(path)
    try {
      const fullData = JSON.parse(data)
      const latestData = migrateData(fullData)
      // 迁移函数不够的情况
      if (latestData.version !== VERSION) {
        toast({
          title: '导入失败',
          description: `导入的脚本版本 ${latestData.version} 与当前版本 ${VERSION} 不匹配，可能需要更新 migrate 逻辑`,
        })
        return
      }
      const isConfirm = await dialog.ask('操作将会覆盖当前脚本列表，是否继续？', {
        title: '导入确认',
        type: 'warning',
      })
      if (!isConfirm) {
        return
      }
      setScripts(latestData.scripts)
    } catch (e) {
      toast({
        title: '导入失败',
        description: `导入失败，请检查文件格式`,
      })
    }
  }, [setScripts])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <DotsVerticalIcon></DotsVerticalIcon>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>数据管理</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExport}>
          导出
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleImport}>
          导入
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}