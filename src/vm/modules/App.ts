import { indicatorEventBus } from '@/components/IndicatorButton';
import { showText as showTextInPlayground } from '@/components/Playground';

export class App {
  static async showText(text: string) {
    showTextInPlayground(text)
  }

  static async start() {
    indicatorEventBus.emit('loading', true)
  }

  static async done() {
    indicatorEventBus.emit('loading', false)
  }
}