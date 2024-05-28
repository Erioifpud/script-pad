import { indicatorEventBus } from '@/components/IndicatorButton';
import {
  showText as showTextInPlayground,
  showComponent as showComponentInPlayground,
  showRawComponent as showRawComponentInPlayground,
} from '@/components/Playground';
import { ReactNode } from 'react';

export class App {
  static async showText(text: string) {
    showTextInPlayground(text)
  }

  static async showComponent(node: ReactNode, style: string) {
    showComponentInPlayground(node, style)
  }

  static async showRawComponent(node: ReactNode) {
    showRawComponentInPlayground(node)
  }

  static async start() {
    indicatorEventBus.emit('loading', true)
  }

  static async done() {
    indicatorEventBus.emit('loading', false)
  }
}