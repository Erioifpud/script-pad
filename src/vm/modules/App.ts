import {
  showText as showTextInPlayground,
  showComponent as showComponentInPlayground,
  showRawComponent as showRawComponentInPlayground,
} from '@/components/Playground/utils';
import { CSSProperties, ReactNode } from 'react';

export class App {
  async showText(text: string) {
    showTextInPlayground(text)
  }

  async showComponent(node: ReactNode, style: string, wrapperStyle?: CSSProperties) {
    showComponentInPlayground(node, style, wrapperStyle)
  }

  async showRawComponent(node: ReactNode) {
    showRawComponentInPlayground(node)
  }

  async start() {
    console.warn('App.start 功能已被移除')
  }

  async done() {
    console.warn('App.done 功能已被移除')
  }
}