import { HTMLAttributes } from 'react';

export type AnyNode = Node<keyof HTMLElementTagNameMap>;

export interface Node<T extends keyof HTMLElementTagNameMap> {
  // 父节点的 id
  parentId: string
  // 自身 id
  id: string
  // 节点名（用作辨识）
  name: string
  // html 元素的类型
  type: T
  // html 元素的属性，给个 monaco 自己填
  attrs: Partial<HTMLAttributes<HTMLElementTagNameMap[T]>>
  // 节点的值，可以为空，如果是大括号包围，则表示是一个表达式
  // 传入的值应该是平铺的，如果不是，自行处理再传入
  value: string
  // 文本样式
  css: string
  // 选项式的部分样式
  // 先使用选项的，然后用 css 覆盖
  styleOption: Record<string, string>
  // 子节点的 ids
  childrenIds: string[]
  // 作为列表模板节点时，参考的数据字段
  listBy: string
  // 作为条件节点时，是否隐藏参考的数据字段
  removeBy: string
}

export interface Group {
  // 自身 id
  id: string
  // 组名
  name: string
  // 组的描述
  description: string
  // 组内节点，平铺
  nodes: AnyNode[]
  // 传入预览的 mock 数据
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockData: Record<string, any>
}

// 选项样式的表单组件类型，结果都应该是字符串，所以 number、string 都归到 text
// color 因为手填颜色不方便，所以单独做一个选择组件
export type SettingFormNodeType = 'text' | 'color'

// 选项样式的配置
export interface SettingItem {
  key: string;
  type: SettingFormNodeType;
  label: string;
  value: string;
  isEnabled: boolean; // 启用状态
}

// 选项样式的配置表，表示所有可以用表单配置的通用样式
export interface SettingMap {
  [key: string]: SettingItem;
}

// 树形节点，由平铺节点转换得到的
export interface TreeNode<T extends keyof HTMLElementTagNameMap> extends Node<T> {
  children: TreeNode<T>[];
}