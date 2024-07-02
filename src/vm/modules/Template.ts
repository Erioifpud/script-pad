import { useLowCodeStore } from '@/store/lowcode';
import { App } from './App';
import { renderTreeNodeFn } from '@/pages/LowCode/components/Preview/renderTreeNodes';
import { convertNestedNode } from '@/pages/LowCode/utils';
import { CSSProperties } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getComponent(id: string, propsData: Record<string, any>) {
  const store = useLowCodeStore.getState();
  const groups = store.groups;
  const group = groups.find((g) => g.id === id);
  if (!group) {
    throw new Error(`找不到 Group{${id}}`);
  }
  const nested = convertNestedNode(group.nodes);
  if (!nested) {
    throw new Error(`Group{${id}} 的 nodes 节点无法转换`);
  }
  const h = renderTreeNodeFn(nested);
  const Component = h(propsData);
  return Component;
}

export class Template {
  /**
   * 在侧边栏显示渲染后的动态组件（仅组件，无截图功能）
   * @param id 分组/模板 id
   * @param propsData 传入显示的数据
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async showRaw(id: string, propsData: Record<string, any>) {
    const Component = getComponent(id, propsData)
    App.showRawComponent(Component)
  }

  /**
   * 在侧边栏显示渲染后的动态组件（iframe，支持截图）
   * @param id 分组/模板 id
   * @param propsData 传入显示的数据
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async show(id: string, propsData: Record<string, any>, wrapperStyle?: CSSProperties) {
    const Component = getComponent(id, propsData)
    App.showComponent(Component, '', wrapperStyle)
  }

  /**
   * 返回组件构造函数，供脚本 jsx 使用
   * @param id 分组/模板 id
   * @param propsData 传入显示的数据
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async use(id: string, propsData: Record<string, any>) {
    const Component = getComponent(id, propsData)
    return Component
  }
}