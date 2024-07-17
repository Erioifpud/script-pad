import { takeScreenshot } from '@/utils';

export class Capture {
  async screenshotElement(el: HTMLElement): Promise<string> {
    return takeScreenshot(el);
  }
}