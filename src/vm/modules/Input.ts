import { Node } from '@/components/InputDialog/type';
import { showInputDialog } from '@/components/InputDialog/utils';
import { inputEventBus } from '@/event';

export class Input {
  static async create(template: Node[]) {
    showInputDialog(template || [])
    return inputEventBus.once('submit')
  }
}