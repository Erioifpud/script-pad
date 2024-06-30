import { SettingMap } from './type';

export function getSettingMap(): SettingMap {
  return {
    'width': {
      key: 'width',
      type: 'text',
      isEnabled: true,
      label: '宽度',
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

export function getInitialSettingOptions() {
  // 按 map 找出启用的，然后整理成 key -> value 的形式
  const settingMap = getSettingMap();
  return Object.keys(settingMap)
    .filter(key => settingMap[key].isEnabled)
    .reduce<Record<string, string>>((acc, key) => {
      acc[key] = settingMap[key].value;
      return acc;
    }, {});
}