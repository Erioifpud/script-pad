import {
  showText as showTextInPlayground,
  showComponent as showComponentInPlayground,
  showRawComponent as showRawComponentInPlayground,
} from '@/components/Playground/utils';
import { CSSProperties, ReactNode } from 'react';
import { eventBus } from '@/event';
import { IndicatorLoadingEvent } from '@/event/impl';

export class App {
  static async showText(text: string) {
    showTextInPlayground(text)
  }

  static async showComponent(node: ReactNode, style: string, wrapperStyle?: CSSProperties) {
    showComponentInPlayground(node, style, wrapperStyle)
  }

  static async showRawComponent(node: ReactNode) {
    showRawComponentInPlayground(node)
  }

  static async start() {
    eventBus.publish('indicator-loading', new IndicatorLoadingEvent(true))
  }

  static async done() {
    eventBus.publish('indicator-loading', new IndicatorLoadingEvent(false))
  }
}