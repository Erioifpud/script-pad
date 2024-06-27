import { takeScreenshot } from '@/utils';

export class Capture {
  static async screenshotElement(el: HTMLElement): Promise<string> {
    return takeScreenshot(el);
  }
}