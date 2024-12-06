import {
  showText as showTextInPlayground,
  showComponent as showComponentInPlayground,
  showRawComponent as showRawComponentInPlayground,
} from '@/components/Playground/utils';
import { CSSProperties, ReactNode } from 'react';

export class App {
  showText(text: string) {
    showTextInPlayground(text)
  }

  showComponent(node: ReactNode, style: string, wrapperStyle?: CSSProperties) {
    showComponentInPlayground(node, style, wrapperStyle)
  }

  showRawComponent(node: ReactNode) {
    showRawComponentInPlayground(node)
  }

  start() {
    console.warn('App.start 功能已被移除')
  }

  done() {
    console.warn('App.done 功能已被移除')
  }
}