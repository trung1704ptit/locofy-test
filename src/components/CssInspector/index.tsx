import { useMemo, useState, useEffect } from 'react';
import type { Node } from '../../types';
import { findNodeById } from '../../lib/nodes';
import { PropertyInputRow } from './../PropertyInputRow';

type Props = {
  nodes: Node[];
  selectedId?: string;
  onChange: ({
    nodeId,
    oldKey,
    oldVal,
    newKey,
    newVal,
  }: {
    nodeId: string;
    oldKey: string | undefined;
    oldVal: string | undefined;
    newKey: string | undefined;
    newVal: string | undefined;
  }) => void;
};

type CssRule = {
  id: string;
  selector: string;
  properties: CssProperty[];
};

type CssProperty = {
  id: string;
  name: string;
  value: string;
  enabled: boolean;
};

export default function CssInspector({ nodes, selectedId, onChange }: Props) {
  const node = useMemo(
    () => (selectedId ? findNodeById(nodes, selectedId) : undefined),
    [nodes, selectedId]
  );
  const [cssRules, setCssRules] = useState<CssRule[]>([]);

  const shouldInitializeRules = useMemo(() => {
    return (
      selectedId && !cssRules.find(rule => rule.selector.includes(selectedId))
    );
  }, [selectedId, cssRules]);

  useEffect(() => {
    if (shouldInitializeRules && node) {
      const defaultRule: CssRule = {
        id: `rule-${selectedId}`,
        selector: `#${selectedId}`,
        properties: [
          {
            id: 'prop-1',
            name: 'display',
            value: String(node.display || 'block'),
            enabled: true,
          },
          {
            id: 'prop-2',
            name: 'width',
            value: `${node.width}px`,
            enabled: true,
          },
          {
            id: 'prop-3',
            name: 'height',
            value: `${node.height}px`,
            enabled: true,
          },
          {
            id: 'prop-4',
            name: 'background',
            value: String(node.background || 'transparent'),
            enabled: true,
          },
          {
            id: 'prop-5',
            name: 'color',
            value: String(node.color || '#000000'),
            enabled: true,
          },
          {
            id: 'prop-6',
            name: 'border',
            value: String(node.border || 'none'),
            enabled: true,
          },
          { id: 'prop-7', name: 'position', value: 'absolute', enabled: true },
          { id: 'prop-8', name: 'left', value: `${node.x}px`, enabled: true },
          { id: 'prop-9', name: 'top', value: `${node.y}px`, enabled: true },
        ],
      };
      setCssRules([defaultRule]);
    }
  }, [shouldInitializeRules, node, selectedId]);

  const currentRule = useMemo(
    () => cssRules.find(rule => rule.selector.includes(selectedId || '')),
    [cssRules, selectedId]
  );

  const handlePropertyChange = (propertyId: string, newValue: string) => {
    if (!currentRule || !node) return;

    const property = currentRule.properties.find(p => p.id === propertyId);
    onChange({
      nodeId: node.id,
      oldKey: property?.name,
      oldVal: property?.value,
      newKey: property?.name,
      newVal: newValue,
    });

    const updatedRules = cssRules.map(rule =>
      rule.id === currentRule.id
        ? {
            ...rule,
            properties: rule.properties.map(prop =>
              prop.id === propertyId ? { ...prop, value: newValue } : prop
            ),
          }
        : rule
    );

    setCssRules(updatedRules);
  };

  const handlePropertyNameChange = (propertyId: string, newName: string) => {
    const property = currentRule?.properties.find(p => p.id === propertyId);
    if (!currentRule || !node || !property) return;

    onChange({
      nodeId: node.id,
      oldKey: property?.name,
      oldVal: property?.value,
      newKey: newName,
      newVal: property.value,
    });

    const valid = CSS.supports(newName, property.value);

    const updatedRules = cssRules.map(rule =>
      rule.id === currentRule.id
        ? {
            ...rule,
            properties: rule.properties.map(prop =>
              prop.id === propertyId
                ? { ...prop, name: newName, enabled: valid }
                : prop
            ),
          }
        : rule
    );

    setCssRules(updatedRules);
  };

  const handlePropertyToggle = (propertyId: string) => {
    if (!currentRule || !node) return;
    const oldProperty = currentRule.properties.find(p => p.id === propertyId);

    const updatedRules = cssRules.map(rule =>
      rule.id === currentRule.id
        ? {
            ...rule,
            properties: rule.properties.map(prop =>
              prop.id === propertyId
                ? { ...prop, enabled: !prop.enabled }
                : prop
            ),
          }
        : rule
    );

    setCssRules(updatedRules);
    const newActiveRule = updatedRules.find(item => item.id === currentRule.id);
    const newProperty = newActiveRule?.properties.find(
      item => item.id === propertyId
    );

    let newVal = '';
    if (newProperty?.enabled) {
      newVal = newProperty?.value;
    }
    onChange({
      nodeId: node.id,
      oldKey: oldProperty?.name,
      oldVal: oldProperty?.value,
      newKey: newProperty?.name,
      newVal,
    });
  };

  if (!node) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-lg mb-2">Select an element</div>
          <div className="text-sm">
            Choose an element from the tree to inspect its styles
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-gray-200 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-gray-900">CSS Inspector</div>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {node.type}
          </div>
        </div>
        <div className="text-sm text-gray-600 mb-3">{node.name}</div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-3">
          {currentRule && (
            <>
              <span className="cursor-default">
                {currentRule.selector} {'{'}
              </span>
              <div className="text-xs font-mono">
                {currentRule.properties.map(prop => (
                  <PropertyInputRow
                    key={prop.id}
                    prop={prop}
                    handlePropertyChange={handlePropertyChange}
                    handlePropertyNameChange={handlePropertyNameChange}
                    handlePropertyToggle={handlePropertyToggle}
                  />
                ))}
              </div>
              <span className="cursor-default">{'}'}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
