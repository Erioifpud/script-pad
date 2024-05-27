import { showText as showTextInPlayground } from '@/components/Playground';

export class App {
  static async showText(text: string) {
    showTextInPlayground(text)
  }
}