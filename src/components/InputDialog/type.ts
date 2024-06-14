interface BaseNode<T> {
  id: string
  value: T
  placeholder: string
}

interface TextNode extends BaseNode<string> {
  type: 'text'
}

interface AreaNode extends BaseNode<string> {
  type: 'area'
}

interface SelectOption {
  label: string
  value: string
}

interface SelectNode extends BaseNode<string> {
  type: 'select'
  options: SelectOption[]
}

interface SliderNode extends BaseNode<number> {
  type: 'slider'
  min: number
  max: number
  step: number
}

interface ColorNode extends BaseNode<string> {
  type: 'color'
}

interface ColorMapNode extends BaseNode<string> {
  type: 'colorMap'
}

export type Node = TextNode | AreaNode | SelectNode | SliderNode | ColorNode | ColorMapNode;