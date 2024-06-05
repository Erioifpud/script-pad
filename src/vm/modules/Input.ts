import { Node } from '@/components/InputDialog/type';
import { showInputDialog } from '@/components/InputDialog/utils';
import { eventBus } from '@/event';

export class Input {
  static async create(template: Node[]) {
    showInputDialog(template || [])
    return eventBus.once('input-submit')
      .then(ev => {
        return ev.values
      })
  }
}