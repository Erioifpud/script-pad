import { eventBus } from '@/event'
import { PlaygroundShowComponent, PlaygroundShowRawComponent, PlaygroundShowText,  } from '@/event/impl'
import { CSSProperties, ReactNode } from 'react'

export const showText = (text: string) => {
  eventBus.publish('playground-show-text', new PlaygroundShowText(text))
}

export const showComponent = (node: ReactNode, style: string = '', wrapperStyle: CSSProperties = {}) => {
  eventBus.publish('playground-show-component', new PlaygroundShowComponent(node, style, wrapperStyle))
}

export const showRawComponent = (node: ReactNode) => {
  eventBus.publish('playground-show-raw-component', new PlaygroundShowRawComponent(node))
}