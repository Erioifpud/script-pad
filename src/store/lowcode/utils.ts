import { getInitialSettingOptions } from './rule';
import { AnyNode } from './type';

export function createNode(uuid: string, parentId: string): AnyNode {
  return {
    id: uuid,
    parentId,
    type: 'div',
    value: 'Hello world!',
    css: '{}',
    attrs: {},
    styleOption: getInitialSettingOptions(),
    childrenIds: [],
    hidden: false,
  }
}