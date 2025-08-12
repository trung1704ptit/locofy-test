import type { Node } from '../types'

export const mockNodes: Node[] = [
  {
    id: 'root-1',
    name: 'Root',
    type: 'Div',
    x: 20,
    y: 20,
    width: 760,
    height: 800,
    background: '#ffffff',
    border: '1px solid #ddd',
    children: [
      { id: 'text-1', name: 'Text 1', type: 'Div', x: 40, y: 40, width: 100, height: 24, text: 'Text 1', children: [] },
      { id: 'text-2', name: 'Text 2', type: 'Div', x: 40, y: 100, width: 440, height: 90, background: '#f4c23a', text: 'Text 2', children: [] },
      {
        id: 'node-3',
        name: 'Node 3',
        type: 'Div',
        x: 40,
        y: 220,
        width: 560,
        height: 160,
        background: '#16a34a',
        children: [
          { id: 'btn-1', name: 'Button 1', type: 'Button', x: 90, y: 20, width: 180, height: 44, background: '#0ea5e9', color: '#fff', text: 'Button 1', children: [] },
          { id: 'img-1', name: 'Image 1', type: 'Image', x: 90, y: 80, width: 180, height: 60, background: '#e9d5ff', text: 'Image 1', children: [] },
        ],
      },
      {
        id: 'node-4',
        name: 'Node 4',
        type: 'Div',
        x: 40,
        y: 420,
        width: 560,
        height: 160,
        background: '#16a34a',
        children: [
          { id: 'btn-2', name: 'Button 2', type: 'Button', x: 90, y: 20, width: 180, height: 44, background: '#0ea5e9', color: '#fff', text: 'Button 2', children: [] },
          { id: 'img-2', name: 'Image 2', type: 'Image', x: 90, y: 80, width: 180, height: 60, background: '#e9d5ff', text: 'Image 2', children: [] },
        ],
      },
    ],
  },
]


