import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { LowCodeContext } from './context';
import { useCurrentGroup } from '../../hooks/useCurrentGroup';
import useConvertToNestedNodes from '../../hooks/useFullNode';
import { invoke } from '@tauri-apps/api';
import { useLowCodeStore } from '@/store/lowcode';
import { SIGN_PLUGIN } from '@/constants';

interface Props {
  children: React.ReactNode;
}

const LowCodeProvider = memo((props: Props) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const insertGroup = useLowCodeStore(state => state.insertGroup);

  const currentGroup = useCurrentGroup();
  const nestedNode = useConvertToNestedNodes(currentGroup?.nodes || []);

  // 当前选中的节点
  const currentNode = useMemo(() => {
    if (!currentGroup) return null;
    const nodes = currentGroup.nodes
    return nodes.find(node => node.id === selectedNodeId) || null
  }, [currentGroup, selectedNodeId]);

  // 切换分组时，清空选中节点
  useEffect(() => {
    setSelectedNodeId('');
  }, [currentGroup?.id]);

  // 导出分组
  const exportGroup = useCallback(async () => {
    if (!currentGroup) return;
    const json = JSON.stringify(currentGroup, null);
    const sign = await invoke<string>(SIGN_PLUGIN.SIGN_TEMPLATE, { template: json });
    return navigator.clipboard.writeText(JSON.stringify({
      sign,
      template: json
    }));
  }, [currentGroup]);

  // 导入分组
  const importGroup = useCallback(async () => {
    const text = await navigator.clipboard.readText();
    try {
      const data = JSON.parse(text);
      const template = JSON.parse(data.template);
      const sign = await invoke<string>(SIGN_PLUGIN.SIGN_TEMPLATE, { template: data.template });
      if (sign !== data.sign) {
        return '签名错误'
      }
      insertGroup(template);
      return '';
    } catch (error) {
      console.error(error);
      return '数据格式错误'
    }
  }, [insertGroup])

  return (
    <LowCodeContext.Provider value={{
      selectedNodeId,
      setSelectedNodeId,
      currentGroup,
      nestedNode,
      currentNode,
      exportGroup,
      importGroup,
    }}>
      {props.children}
    </LowCodeContext.Provider>
  )
});

export default LowCodeProvider;