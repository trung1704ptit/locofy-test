/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import type { Node } from './types';
import { mockNodes } from './data/mockNodes';
import { computeComponentLabels, updateNodeById } from './lib/nodes';
import TreeView from './components/TreeView';
import CanvasPreview from './components/CanvasPreview';
import CssInspector from './components/CssInspector';

function App() {
  const [nodes, setNodes] = useState<Node[]>(mockNodes);
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const componentLabels = useMemo(() => computeComponentLabels(nodes), [nodes]);

  const handleStyleChange = ({
    nodeId,
    oldKey,
    newKey,
    newVal,
  }: {
    nodeId: string;
    oldKey: string | undefined;
    oldVal: string | undefined;
    newKey: string | undefined;
    newVal: string | undefined;
  }) => {
    setNodes(prev =>
      updateNodeById(prev, nodeId, n => {
        const updated: Node = { ...n };
        if (oldKey && (updated as Record<string, any>)[oldKey] !== undefined) {
          delete (updated as Record<string, any>)[oldKey];
        }

        if (newKey) {
          (updated as Record<string, any>)[newKey] = newVal;
        }
        return updated;
      })
    );
  };

  return (
    <div className="grid grid-cols-[300px_1fr_400px] h-screen">
      <div className="border-r border-gray-200 overflow-auto bg-gray-50">
        <div className="px-4 py-3 font-semibold border-b border-gray-200">
          Tree View
        </div>
        <TreeView
          nodes={nodes}
          selectedId={selectedId}
          onSelect={setSelectedId}
          componentLabels={componentLabels}
        />
      </div>
      <div className="flex flex-col">
        <div className="px-4 py-3 font-semibold border-b border-gray-200">
          Preview
        </div>
        <div className="relative flex-1 bg-slate-100 overflow-auto">
          <CanvasPreview
            nodes={nodes}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
      </div>
      <div className="border-l border-gray-200 overflow-auto">
        <CssInspector
          nodes={nodes}
          selectedId={selectedId}
          onChange={handleStyleChange}
        />
      </div>
    </div>
  );
}

export default App;
