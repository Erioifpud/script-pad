import { inputEventBus, Node, showInputDialog } from '@/components/InputDialog';

export class Input {
  static async create(template: Node[]) {
    showInputDialog(template || [])
    return inputEventBus.once('submit')
  }
}