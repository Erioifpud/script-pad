import { SettingMap } from './type';

export function getDefaultStyle(): Record<string, string> {
  return {
    position: 'relative',
    boxSizing: 'border-box',
  }
}

export function getSettingMap(): SettingMap {
  return {
    'width': {
      key: 'width',
      type: 'text',
      isEnabled: true,
      label: '宽度',
      // value 用于初始化，不作为表单默认值
      // 使用时应该用节点实际的数据和这个默认数据合并
      value: '100px'
    },
    'height': {
      key: 'height',
      type: 'text',
      isEnabled: true,
      label: '高度',
      value: '100px'
    }
  }
}

export function getSettingOptions(settingMap: SettingMap) {
  // 按 map 找出启用的，然后整理成 key -> value 的形式
  return Object.keys(settingMap)
    .filter(key => settingMap[key].isEnabled)
    .reduce<Record<string, string>>((acc, key) => {
      acc[key] = settingMap[key].value;
      return acc;
    }, {});
}

export function getInitialSettingOptions() {
  return getSettingOptions(getSettingMap());
}