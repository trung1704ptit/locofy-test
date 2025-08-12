import { useMemo, useState } from 'react'
import type { Node } from './types'
import { mockNodes } from './data/mockNodes'
import { computeComponentLabels, updateNodeById } from './lib/nodes'
import TreeView from './components/TreeView.tsx'
import CanvasPreview from './components/CanvasPreview.tsx'
import CssInspector from './components/CssInspector.tsx'

function App() {
  const [nodes, setNodes] = useState<Node[]>(mockNodes)
  const [selectedId, setSelectedId] = useState<string | undefined>()

  const componentLabels = useMemo(() => computeComponentLabels(nodes), [nodes])

  const handleStyleChange = (nodeId: string, key: string, value: string) => {
    setNodes((prev) =>
      updateNodeById(prev, nodeId, (n) => {
        const knownKeys = new Set([
          'display', 'position', 'zIndex',
          'margin', 'padding', 'border', 'borderRadius',
          'background', 'color', 'fontSize', 'fontFamily', 'fontWeight', 'textAlign'
        ])
        const updated: Node = { ...n }
        if (knownKeys.has(key)) {
          ;(updated as any)[key] = value
        } else {
          updated.styles = { ...(updated.styles || {}), [key]: value }
        }
        return updated
      }),
    )
  }

  return (
    <div className="grid grid-cols-[280px_1fr_360px] h-screen">
      <div className="border-r border-gray-200 overflow-auto bg-gray-50">
        <div className="px-4 py-3 font-semibold border-b border-gray-200">Tree View</div>
        <TreeView
          nodes={nodes}
          selectedId={selectedId}
          onSelect={setSelectedId}
          componentLabels={componentLabels}
        />
      </div>
      <div className="flex flex-col">
        <div className="px-4 py-3 font-semibold border-b border-gray-200">Preview</div>
        <div className="relative flex-1 bg-slate-100 overflow-auto">
          <CanvasPreview nodes={nodes} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </div>
      <div className="border-l border-gray-200 overflow-auto">
        <CssInspector nodes={nodes} selectedId={selectedId} onChange={handleStyleChange} />
      </div>
    </div>
  )
}

export default App


