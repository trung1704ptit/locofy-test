/* eslint-disable @typescript-eslint/no-explicit-any */
import CanvasPreview from '@/components/CanvasPreview';
import CssInspector from '@/components/CssInspector';
import TreeView from '@/components/TreeView';
import { mockNodes } from '@/data/mockNodes';
import { computeComponentLabels, updateNodeById } from '@/lib/nodes';
import type { Node } from '@/types';
import { useMemo, useState } from 'react';

function App() {
  const [nodes, setNodes] = useState<Node[]>(mockNodes);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [cssRules, setCssRules] = useState<
    Array<{
      selector: string;
      properties: Array<{
        name: string;
        value: string;
        enabled: boolean;
      }>;
    }>
  >([]);

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
    console.log('handleStyleChange called:', {
      nodeId,
      oldKey,
      newKey,
      newVal,
    });

    setNodes(prev => {
      const updated = updateNodeById(prev, nodeId, n => {
        const updatedNode: Node = { ...n };
        if (
          oldKey &&
          (updatedNode as Record<string, any>)[oldKey] !== undefined
        ) {
          console.log('Deleting old property:', oldKey);
          delete (updatedNode as Record<string, any>)[oldKey];
        }

        if (newKey) {
          console.log('Setting new property:', newKey, '=', newVal);
          (updatedNode as Record<string, any>)[newKey] = newVal;
        }

        console.log('Updated node:', updatedNode);
        return updatedNode;
      });

      console.log('Updated nodes:', updated);
      return updated;
    });
  };

  const handleCssRulesChange = (
    newCssRules: Array<{
      selector: string;
      properties: Array<{
        name: string;
        value: string;
        enabled: boolean;
      }>;
    }>
  ) => {
    setCssRules(newCssRules);
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
            cssRules={cssRules}
          />
        </div>
      </div>
      <div className="border-l border-gray-200 overflow-auto">
        <CssInspector
          nodes={nodes}
          selectedId={selectedId}
          onChange={handleStyleChange}
          onCssRulesChange={handleCssRulesChange}
        />
      </div>
    </div>
  );
}

export default App;
