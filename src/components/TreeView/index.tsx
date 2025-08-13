import type { Node } from '@/types';
import { useState } from 'react';

type Props = {
  nodes: Node[];
  selectedId?: string;
  onSelect: (id: string) => void;
  componentLabels: Record<string, string>;
};

export function TreeView({
  nodes,
  selectedId,
  onSelect,
  componentLabels,
}: Props) {
  return (
    <div className="divide-y divide-gray-100">
      {nodes.map(n => (
        <TreeNode
          key={n.id}
          node={n}
          depth={0}
          selectedId={selectedId}
          onSelect={onSelect}
          componentLabels={componentLabels}
        />
      ))}
    </div>
  );
}

function TreeNode({
  node,
  depth,
  selectedId,
  onSelect,
  componentLabels,
}: {
  node: Node;
  depth: number;
  selectedId?: string;
  onSelect: (id: string) => void;
  componentLabels: Record<string, string>;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const label = componentLabels[node.id];
  const typeLetter =
    node.type === 'Div'
      ? node.text
        ? 'T'
        : 'D'
      : node.type === 'Button'
        ? 'B'
        : 'I';

  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-indigo-50 ${selectedId === node.id ? 'bg-indigo-100' : ''}`}
        style={{ paddingLeft: depth * 12 }}
        onClick={e => {
          e.stopPropagation();
          onSelect(node.id);
        }}
      >
        {hasChildren ? (
          <button
            className="w-5 h-5 border-none bg-transparent cursor-pointer outline-none"
            onClick={e => {
              e.stopPropagation();
              setExpanded(v => !v);
            }}
          >
            {expanded ? '▼' : '▶'}
          </button>
        ) : (
          <span className="w-5 inline-block" />
        )}
        <span className="w-4 text-gray-900">{typeLetter}</span>
        <span className="font-medium">{node.name}</span>
        {label && (
          <span className="ml-auto text-xs px-1.5 py-0.5 rounded border border-cyan-500 bg-cyan-50 text-cyan-800">
            {label}
          </span>
        )}
      </div>
      {hasChildren && expanded && (
        <div>
          {node.children.map(c => (
            <TreeNode
              key={c.id}
              node={c}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              componentLabels={componentLabels}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TreeView;
