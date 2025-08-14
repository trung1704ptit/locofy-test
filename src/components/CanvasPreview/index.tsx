import { APP_CONFIG } from '@/constants';
import { nodeToStyle } from '@/lib/nodes';
import type { Node } from '@/types';
import { useMemo, useState } from 'react';

type Props = {
  nodes: Node[];
  selectedId?: string;
  onSelect: (id: string) => void;
  cssRules?: Array<{
    selector: string;
    properties: Array<{
      name: string;
      value: string;
      enabled: boolean;
    }>;
  }>;
};

export default function CanvasPreview({
  nodes,
  selectedId,
  onSelect,
  cssRules = [],
}: Props) {
  const [zoom, setZoom] = useState<number>(
    APP_CONFIG.canvasPreview.defaultZoom
  );

  // Generate CSS rules for the canvas
  const cssStyles = useMemo(() => {
    if (!cssRules.length) return '';

    const cssText = cssRules
      .map(rule => {
        const enabledProperties = rule.properties.filter(prop => prop.enabled);
        if (enabledProperties.length === 0) return '';

        const propertiesText = enabledProperties
          .map(prop => `  ${prop.name}: ${prop.value};`)
          .join('\n');

        return `${rule.selector} {\n${propertiesText}\n}`;
      })
      .filter(rule => rule.length > 0)
      .join('\n\n');

    return cssText;
  }, [cssRules]);

  const handleZoomIn = () => {
    setZoom(prev =>
      Math.min(
        prev + APP_CONFIG.canvasPreview.zoomStep,
        APP_CONFIG.canvasPreview.maxZoom
      )
    );
  };

  const handleZoomOut = () => {
    setZoom(prev =>
      Math.max(
        prev - APP_CONFIG.canvasPreview.zoomStep,
        APP_CONFIG.canvasPreview.minZoom
      )
    );
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* CSS Styles */}
      {cssStyles && <style>{cssStyles}</style>}

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 flex items-center justify-center text-sm font-medium"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 flex items-center justify-center text-sm font-medium"
          title="Zoom Out"
        >
          −
        </button>
        <div className="text-xs text-center text-gray-600 bg-white px-2 py-1 rounded border border-gray-300">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Canvas Container with proper overflow handling */}
      <div className="w-full h-full overflow-auto">
        {/* Canvas Content */}
        <div
          className="relative min-w-full min-h-full"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            width: `${100 / zoom}%`,
            height: `${100 / zoom}%`,
          }}
        >
          {nodes.map(n => (
            <RenderNode
              key={n.id}
              node={n}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
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
    id: node.id, // Add ID for CSS targeting
    className: `${isSelected ? 'outline outline-2 outline-indigo-500' : ''}`,
    style: {
      ...style,
      // Ensure nodes don't overflow their container
      maxWidth: '100%',
      boxSizing: 'border-box' as const,
    },
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
          style={{
            ...commonProps.style,
            objectFit: 'contain' as const,
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      );
    case 'Input':
      return (
        <input
          {...commonProps}
          defaultValue={node.text}
          style={{
            ...commonProps.style,
            maxWidth: '100%',
            boxSizing: 'border-box' as const,
          }}
        />
      );
    case 'Button':
      return (
        <button
          {...commonProps}
          style={{
            ...commonProps.style,
            maxWidth: '100%',
            boxSizing: 'border-box' as const,
            whiteSpace: 'nowrap' as const,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {node.text || node.name}
        </button>
      );
    default:
      return (
        <div
          {...commonProps}
          style={{
            ...commonProps.style,
            maxWidth: '100%',
            boxSizing: 'border-box' as const,
          }}
        >
          {node.text}
        </div>
      );
  }
}
