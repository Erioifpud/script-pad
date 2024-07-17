interface CategoryItem {
  type: 'category'
  label: string
  color: string
}

interface TextItem {
  type: 'text'
  label: string
  description: string
  key: string
  defaultValue: string
  placeholder: string
}

interface FilePathItem {
  type: 'filePath'
  label: string
  description: string
  key: string
  defaultValue: string
}

interface DirPathItem {
  type: 'dirPath'
  label: string
  description: string
  key: string
  defaultValue: string
}

interface BooleanItem {
  type: 'bool'
  label: string
  description: string
  key: string
  defaultValue: boolean
}

interface NumberItem {
  type: 'num'
  label: string
  description: string
  key: string
  defaultValue: number
  placeholder: string
}

interface Option {
  label: string
  value: string
}

interface SelectItem {
  type: 'select'
  label: string
  description: string
  key: string
  defaultValue: string
  options: Option[]
}

interface TextAreaItem {
  type: 'textArea'
  label: string
  description: string
  key: string
  defaultValue: string
  placeholder: string
}

export type FormItem = TextItem | NumberItem | SelectItem | TextAreaItem | BooleanItem | DirPathItem | FilePathItem

export type SettingItem = CategoryItem | FormItem

export type SettingValueType = FormItem['defaultValue']

export type SettingKey = FormItem['key']

export type FormDefaultValueMap = { [P in FormItem['key']]: FormItem['defaultValue'] }
export function getDefaultValueMap<T extends SettingItem>(items: T[]) {
  return items.reduce((acc, cur) => {
    if (cur.type === 'category') return acc
    acc[cur.key] = cur.defaultValue
    return acc
  }, {} as FormDefaultValueMap)
}

export const settingRules: SettingItem[] = [
  { type: 'category', label: '数据备份', color: '#228BE6' },
  { type: 'dirPath', label: '备份目录', description: '软件数据的备份目录（可选择同步盘目录）', key: 'backupDir', defaultValue: '' },
]
