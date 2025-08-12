export type NodeType = 'Div' | 'Input' | 'Image' | 'Button'

export type Node = {
  id: string
  x: number
  y: number
  name: string
  type: NodeType
  width: number
  height: number
  
  // Layout properties
  display?: string
  position?: string
  zIndex?: number
  
  // Box model properties
  margin?: string
  padding?: string
  border?: string
  borderRadius?: string
  
  // Visual properties
  background?: string
  color?: string
  fontSize?: string
  fontFamily?: string
  fontWeight?: string
  textAlign?: string
  
  // Content
  text?: string
  
  // Children and styles
  children: Node[]
  styles?: Record<string, string>
}

export type ComponentLabels = Record<string, string>


