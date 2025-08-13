import { PropertyInputRow } from '@/components/PropertyInputRow';
import {
  APP_CONFIG,
  COMMON_VALUES,
  CSS_PROPERTIES,
  CSS_VALUES,
  EVENTS,
} from '@/constants';
import { findNodeById } from '@/lib/nodes';
import type { Node } from '@/types';
import { useEffect, useMemo, useState } from 'react';

// Remove the old constants since they're now imported
// const CSS_PROPERTIES = [...]
// const CSS_VALUES = {...}
// const COMMON_VALUES = [...]

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
    console.log('handlePropertyChange:', {
      propertyId,
      newValue,
      propertyName: property?.name,
      currentProperties: currentRule.properties,
    });

    onChange({
      nodeId: node.id,
      oldKey: property?.name,
      oldVal: property?.value,
      newKey: property?.name,
      newVal: newValue,
    });

    // Check if this property name already exists (excluding the current property)
    const existingProperty = currentRule.properties.find(
      p => p.id !== propertyId && p.name.trim() === property?.name.trim()
    );

    console.log('existingProperty found in value change:', existingProperty);

    // Validate the property when value changes
    const valid =
      property?.name.trim() && newValue.trim()
        ? CSS.supports(property.name, newValue)
        : true;

    const updatedRules = cssRules.map(rule =>
      rule.id === currentRule.id
        ? {
            ...rule,
            properties: rule.properties.map(prop => {
              if (prop.id === propertyId) {
                // Update the current property
                return { ...prop, value: newValue, enabled: valid };
              } else if (existingProperty && prop.id === existingProperty.id) {
                // Disable the existing duplicate property
                console.log(
                  'Disabling duplicate property in value change:',
                  prop.id,
                  prop.name
                );
                return { ...prop, enabled: false };
              }
              return prop;
            }),
          }
        : rule
    );

    console.log('Updated rules in value change:', updatedRules);
    setCssRules(updatedRules);
  };

  const handlePropertyNameChange = (propertyId: string, newName: string) => {
    const property = currentRule?.properties.find(p => p.id === propertyId);
    if (!currentRule || !node || !property) return;

    console.log('handlePropertyNameChange:', {
      propertyId,
      newName,
      currentProperties: currentRule.properties,
    });

    onChange({
      nodeId: node.id,
      oldKey: property?.name,
      oldVal: property?.value,
      newKey: newName,
      newVal: property.value,
    });

    // Check if this property name already exists (excluding the current property)
    const existingProperty = currentRule.properties.find(
      p => p.id !== propertyId && p.name.trim() === newName.trim()
    );

    console.log('existingProperty found:', existingProperty);

    // Only validate if both name and value are present
    const valid =
      newName.trim() && property.value.trim()
        ? CSS.supports(newName, property.value)
        : true;

    const updatedRules = cssRules.map(rule =>
      rule.id === currentRule.id
        ? {
            ...rule,
            properties: rule.properties.map(prop => {
              if (prop.id === propertyId) {
                // Update the current property
                return { ...prop, name: newName, enabled: valid };
              } else if (existingProperty && prop.id === existingProperty.id) {
                // Disable the existing duplicate property
                console.log(
                  'Disabling duplicate property:',
                  prop.id,
                  prop.name
                );
                return { ...prop, enabled: false };
              }
              return prop;
            }),
          }
        : rule
    );

    console.log('Updated rules:', updatedRules);
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

  const addNewProperty = () => {
    if (!currentRule || !node) return;

    // Check if there's already an empty property form
    const existingEmptyProperty = currentRule.properties.find(
      prop => !prop.name.trim() && !prop.value.trim()
    );

    if (existingEmptyProperty) {
      // Focus on the existing empty property form
      // We'll use a custom event to trigger focus
      setTimeout(() => {
        const event = new CustomEvent(EVENTS.FOCUS_EMPTY_PROPERTY, {
          detail: { propertyId: existingEmptyProperty.id },
        });
        window.dispatchEvent(event);
      }, APP_CONFIG.cssInspector.focusDelay);
      return;
    }

    console.log(
      'Adding new property, current properties:',
      currentRule.properties
    );

    const newProperty: CssProperty = {
      id: `prop-${Date.now()}`,
      name: '',
      value: '',
      enabled: true,
    };

    const updatedRules = cssRules.map(rule =>
      rule.id === currentRule.id
        ? {
            ...rule,
            properties: [...rule.properties, newProperty],
          }
        : rule
    );

    setCssRules(updatedRules);

    // Focus on the newly added property form
    setTimeout(() => {
      const event = new CustomEvent(EVENTS.FOCUS_EMPTY_PROPERTY, {
        detail: { propertyId: newProperty.id },
      });
      window.dispatchEvent(event);
    }, APP_CONFIG.cssInspector.focusDelay);
  };

  const removeProperty = (propertyId: string) => {
    if (!currentRule || !node) return;

    const property = currentRule.properties.find(p => p.id === propertyId);
    if (property) {
      onChange({
        nodeId: node.id,
        oldKey: property.name,
        oldVal: property.value,
        newKey: undefined,
        newVal: undefined,
      });
    }

    const updatedRules = cssRules.map(rule =>
      rule.id === currentRule.id
        ? {
            ...rule,
            properties: rule.properties.filter(prop => prop.id !== propertyId),
          }
        : rule
    );

    setCssRules(updatedRules);
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
              <div className="flex items-center justify-between mb-2">
                <span
                  className="cursor-pointer font-mono text-sm hover:text-blue-600 transition-colors"
                  onClick={addNewProperty}
                  title="Click to add new property"
                >
                  {currentRule.selector} {'{'}
                </span>
                <button
                  onClick={addNewProperty}
                  className="px-2 py-1 cursor-pointer text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  + Add Property
                </button>
              </div>
              <div className="text-xs font-mono">
                {currentRule.properties.map(prop => (
                  <PropertyInputRow
                    key={prop.id}
                    prop={prop}
                    handlePropertyChange={handlePropertyChange}
                    handlePropertyNameChange={handlePropertyNameChange}
                    handlePropertyToggle={handlePropertyToggle}
                    onRemove={() => removeProperty(prop.id)}
                    cssProperties={CSS_PROPERTIES}
                    cssValues={CSS_VALUES}
                    commonValues={COMMON_VALUES}
                  />
                ))}
              </div>
              <span
                className="cursor-pointer font-mono text-sm hover:text-blue-600 transition-colors"
                onClick={addNewProperty}
                title="Click to add new property"
              >
                {'}'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
