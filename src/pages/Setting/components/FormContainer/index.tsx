import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useSettingStore } from '@/store/setting';
import { FormDefaultValueMap, FormItem, SettingItem, SettingKey, settingRules, SettingValueType } from '@/store/setting/rule';
import { dialog } from '@tauri-apps/api';
import { memo } from 'react';

type SetSettingType = (key: SettingKey, value: SettingValueType) => void

interface ItemRowProps {
  settingItem: FormItem
  children: React.ReactNode
}

const ItemRow = memo((props: ItemRowProps) => {
  return (
    <div className="relative flex items-center justify-between">
      <div className="left flex flex-col gap-2">
        <div className="font-bold text-sm">{props.settingItem.label}</div>
        <div className="text-xs text-gray-500">{props.settingItem.description}</div>
      </div>
      <div className="right">
        {props.children}
      </div>
    </div>
  )
})

const renderItem = (settingItem: SettingItem, settings: FormDefaultValueMap, setSetting: SetSettingType) => {
  const value = settingItem.type === 'category' ? '' : settings[settingItem.key]

  switch (settingItem.type) {
    case 'category':
      return (
        <div key={settingItem.label} className="text font-bold flex items-center gap-3">
          <div
            className="inline-block w-4 h-4 rounded-lg"
            style={{
              backgroundColor: settingItem.color,
            }}
          ></div>
          <div className="">{settingItem.label}</div>
        </div>
      )
    case 'text':
      return (
        <ItemRow key={settingItem.key} settingItem={settingItem}>
          <Input
            type="text"
            placeholder={settingItem.placeholder}
            value={value as string}
            onChange={(e) => {
              setSetting(settingItem.key, e.target.value)
            }}
          />
        </ItemRow>
      )
    case 'num':
      return (
        <ItemRow key={settingItem.key} settingItem={settingItem}>
          <Input
            type="number"
            placeholder={settingItem.placeholder}
            value={value as number}
            onChange={(e) => {
              setSetting(settingItem.key, e.target.value)
            }}
          />
        </ItemRow>
      )
    case 'filePath':
      return (
        <ItemRow key={settingItem.key} settingItem={settingItem}>
          <Input
            type="text"
            placeholder="点击选择文件"
            value={value as string}
            onClick={async () => {
              const path = await dialog.open({
                directory: false,
                multiple: false,
              }) as string | null
              if (!path) return
              setSetting(settingItem.key, path)
            }}
            readOnly
          />
        </ItemRow>
      )
    case 'dirPath':
      return (
        <ItemRow key={settingItem.key} settingItem={settingItem}>
          <Input
            type="text"
            placeholder="点击选择目录"
            value={value as string}
            onClick={async () => {
              const path = await dialog.open({
                directory: true,
                multiple: false,
              }) as string | null
              if (!path) return
              setSetting(settingItem.key, path)
            }}
            readOnly
          />
        </ItemRow>
      )
    case 'bool':
      return (
        <ItemRow key={settingItem.key} settingItem={settingItem}>
          <Switch
            checked={value as boolean}
            onCheckedChange={(checked) => {
              setSetting(settingItem.key, checked)
            }}
          />
        </ItemRow>
      )
      case 'select':
        return (
          <ItemRow key={settingItem.key} settingItem={settingItem}>
            <Select
              value={value as string}
              onValueChange={(value) => {
                setSetting(settingItem.key, value)
              }}
            >
              <SelectTrigger className="w-[185px]">
                <SelectValue placeholder={settingItem.defaultValue} />
              </SelectTrigger>
              <SelectContent>
                {settingItem.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ItemRow>
        )
      case 'textArea':
        return (
          <ItemRow key={settingItem.key} settingItem={settingItem}>
            <Textarea
              placeholder={settingItem.placeholder}
              value={value as string}
              onChange={(ev) => {
                setSetting(settingItem.key, ev.target.value)
              }}
              rows={3}
              readOnly
            />
          </ItemRow>
        )
    default:
      return null
  }
}

const renderItems = (rules: SettingItem[], settings: FormDefaultValueMap, setSetting: SetSettingType) => {
  return rules.map((settingItem) => {
    const Component = renderItem(settingItem, settings, setSetting)
    if (!Component) {
      return null
    }
    return (
      <>
        {Component}
        <div className="border-b border-solid border-gray-200 my-3"></div>
      </>
    )
  })
}

const FormContainer = memo(() => {
  const settings = useSettingStore(state => state.settings)
  const setSetting = useSettingStore(state => state.setSetting)

  return (
    <div className="relative w-full h-full overflow-y-auto overflow-x-hidden p-4">
      <div className="text-2xl font-bold mt-4 mb-8">设置</div>
      {renderItems(settingRules, settings, setSetting)}
    </div>
  )
})

export default FormContainer;
