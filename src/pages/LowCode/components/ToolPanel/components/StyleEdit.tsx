import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { LowCodeContext } from '@/pages/LowCode/context/LowCodeContext/context';
import { useLowCodeStore } from '@/store/lowcode';
import { getSettingMap, getSettingOptions } from '@/store/lowcode/rule';
import { AnyNode, SettingMap } from '@/store/lowcode/type';
import { produce } from 'immer';
import { map, forEach } from 'lodash-es';
import { memo, useCallback, useContext, useEffect, useState } from 'react';

function mergeSettingMap(settingMap: SettingMap, currentNode: AnyNode) {
  const map = {...settingMap}
  const nodeStyle = currentNode.styleOption
  forEach(nodeStyle, (value, key) => {
    if (map[key]) {
      const setting = map[key]
      setting.value = value
      setting.isEnabled = true
    }
  })
  return map;
}

const StyleEdit = memo(() => {
  const { currentNode, currentGroup } = useContext(LowCodeContext);
  const setGroup = useLowCodeStore(state => state.setGroup);
  // 合并了节点实际数据的 settingMap
  const [settingMap, setSettingMap] = useState(getSettingMap());

  useEffect(() => {
    setSettingMap(
      mergeSettingMap(getSettingMap(), currentNode!)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNode?.id])

  useEffect(() => {
    const newGroup = produce(currentGroup!, draft => {
      const node = draft.nodes.find(item => item.id === currentNode?.id)
      if (node) {
        node.styleOption = getSettingOptions(settingMap)
      }
    })
    setGroup(newGroup.id, newGroup)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingMap])

  const handleEnabledChange = useCallback((value: boolean, key: string) => {
    const newMap = produce(settingMap, draft => {
      const setting = draft[key]
      setting.isEnabled = value
    })
    setSettingMap(newMap)
  }, [settingMap])

  const handleValueChange = useCallback((value: string, key: string) => {
    const newMap = produce(settingMap, draft => {
      const setting = draft[key]
      setting.value = value
    })
    setSettingMap(newMap)
  }, [settingMap])

  return (
    <div className="relative mt-4">
      <div className="px-1">
        <div className="item mb-4">
          <div className="label mb-2 text-sm">快速样式编辑</div>
          {map(settingMap, (setting, key) => {
            return (
              <div className="mt-2" key={setting.key}>
                <div className="label mb-2 text-sm flex items-center">
                  <Checkbox
                    checked={setting.isEnabled}
                    onCheckedChange={(e) => handleEnabledChange(!!e, key)}
                    className="mr-2"
                  />
                  <span>{setting.label}</span>
                </div>
                <div className="bg-white">
                  <Input
                    key={key}
                    value={setting.value}
                    onChange={(e) => handleValueChange(e.target.value, key)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
});

export default StyleEdit;
