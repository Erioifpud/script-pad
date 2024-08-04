import { getInitialSettingOptions } from './rule';
import { AnyNode } from './type';

export function createNode(uuid: string, parentId: string, value: string = ''): AnyNode {
  return {
    id: uuid,
    name: '',
    parentId,
    type: 'div',
    value,
    css: ':root {}',
    attrs: {},
    styleOption: getInitialSettingOptions(),
    childrenIds: [],
    listBy: '',
    removeBy: '',
  }
}