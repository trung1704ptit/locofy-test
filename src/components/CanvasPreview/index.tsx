import type React from 'react';
import type { Node } from '../../types';
import { nodeToStyle } from '../../lib/nodes';

type Props = {
  nodes: Node[];
  selectedId?: string;
  onSelect: (id: string) => void;
};

export default function CanvasPreview({ nodes, selectedId, onSelect }: Props) {
  return (
    <div className="w-full h-full relative">
      {nodes.map(n => (
        <RenderNode
          key={n.id}
          node={n}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function RenderNode({
  node,
  selectedId,
  onSelect,
}: {
  node: Node;
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  const style = nodeToStyle(node);
  const isSelected = selectedId === node.id;

  const commonProps = {
    className: `${isSelected ? 'outline outline-2 outline-indigo-500' : ''}`,
    style,
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(node.id);
    },
  };

  switch (node.type) {
    case 'Div':
      return (
        <div {...commonProps}>
          {node.text}
          {node.children?.map(c => (
            <RenderNode
              key={c.id}
              node={c}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      );
    case 'Image':
      return (
        <img
          {...commonProps}
          alt={node.name}
          src={'https://placehold.co/180x60'}
        />
      );
    case 'Input':
      return <input {...commonProps} defaultValue={node.text} />;
    case 'Button':
      return <button {...commonProps}>{node.text || node.name}</button>;
    default:
      return <div {...commonProps}>{node.text}</div>;
  }
}
