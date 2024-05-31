import { playgroundEventBus } from '@/event'
import { CSSProperties, ReactNode } from 'react'

export const showText = (text: string) => {
  playgroundEventBus.emit('show-text', text)
}

export const showComponent = (node: ReactNode, style: string = '', wrapperStyle: CSSProperties = {}) => {
  playgroundEventBus.emit('show-component', node, style, wrapperStyle)
}

export const showRawComponent = (node: ReactNode) => {
  playgroundEventBus.emit('show-raw-component', node)
}