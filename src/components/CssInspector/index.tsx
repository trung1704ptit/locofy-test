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
  onCssRulesChange?: (
    cssRules: Array<{
      selector: string;
      properties: Array<{
        name: string;
        value: string;
        enabled: boolean;
      }>;
    }>
  ) => void;
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

export default function CssInspector({
  nodes,
  selectedId,
  onChange,
  onCssRulesChange,
}: Props) {
  const node = useMemo(
    () => (selectedId ? findNodeById(nodes, selectedId) : undefined),
    [nodes, selectedId]
  );
  const [cssRules, setCssRules] = useState<CssRule[]>([]);

  // Call onCssRulesChange whenever cssRules change
  useEffect(() => {
    onCssRulesChange?.(cssRules);
  }, [cssRules, onCssRulesChange]);

  const shouldInitializeRules = useMemo(() => {
    return (
      selectedId && !cssRules.find(rule => rule.selector.includes(selectedId))
    );
  }, [selectedId, cssRules]);

  useEffect(() => {
    if (shouldInitializeRules && node) {
      // Test CSS.supports for common properties
      console.log('Testing CSS.supports:');
      console.log(
        'padding: 10px ->',
        typeof CSS !== 'undefined' && CSS.supports
          ? CSS.supports('padding', '10px')
          : 'CSS.supports not available'
      );
      console.log(
        'margin: 20px ->',
        typeof CSS !== 'undefined' && CSS.supports
          ? CSS.supports('margin', '20px')
          : 'CSS.supports not available'
      );
      console.log(
        'color: red ->',
        typeof CSS !== 'undefined' && CSS.supports
          ? CSS.supports('color', 'red')
          : 'CSS.supports not available'
      );

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
      nodeId: node.id,
      nodeType: node.type,
    });

    // Convert kebab-case CSS property names to camelCase for the Node type
    const camelCaseKey = property?.name
      ? property.name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      : undefined;
    const oldCamelCaseKey = property?.name
      ? property.name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      : undefined;

    onChange({
      nodeId: node.id,
      oldKey: oldCamelCaseKey,
      oldVal: property?.value,
      newKey: camelCaseKey,
      newVal: newValue,
    });

    // Update the property value immediately without validation
    const updatedRules = cssRules.map(rule =>
      rule.id === currentRule.id
        ? {
            ...rule,
            properties: rule.properties.map(prop => {
              if (prop.id === propertyId) {
                // Update the current property without validation
                return { ...prop, value: newValue };
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

    // Convert kebab-case CSS property names to camelCase for the Node type
    const oldCamelCaseKey = property?.name
      ? property.name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      : undefined;
    const newCamelCaseKey = newName
      ? newName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      : undefined;

    onChange({
      nodeId: node.id,
      oldKey: oldCamelCaseKey,
      oldVal: property?.value,
      newKey: newCamelCaseKey,
      newVal: property.value,
    });

    // Update the property name immediately without validation
    const updatedRules = cssRules.map(rule =>
      rule.id === currentRule.id
        ? {
            ...rule,
            properties: rule.properties.map(prop => {
              if (prop.id === propertyId) {
                // Update the current property without validation
                return { ...prop, name: newName };
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

    // Convert kebab-case CSS property names to camelCase for the Node type
    const oldCamelCaseKey = oldProperty?.name
      ? oldProperty.name.replace(/-([a-z])/g, (_, letter) =>
          letter.toUpperCase()
        )
      : undefined;
    const newCamelCaseKey = newProperty?.name
      ? newProperty.name.replace(/-([a-z])/g, (_, letter) =>
          letter.toUpperCase()
        )
      : undefined;

    onChange({
      nodeId: node.id,
      oldKey: oldCamelCaseKey,
      oldVal: oldProperty?.value,
      newKey: newCamelCaseKey,
      newVal,
    });
  };

  // Function to handle duplicate properties when a change is finalized
  const handleDuplicateProperties = (propertyId: string) => {
    if (!currentRule) return;

    const property = currentRule.properties.find(p => p.id === propertyId);
    if (!property || !property.name.trim()) return;

    // Validate the CSS property
    let valid = true;
    if (property.name.trim() && property.value.trim()) {
      try {
        // Use CSS.supports if available, otherwise assume valid
        valid =
          typeof CSS !== 'undefined' && CSS.supports
            ? CSS.supports(property.name, property.value)
            : true;
        console.log('CSS validation result:', {
          propertyName: property.name,
          value: property.value,
          valid,
        });
      } catch (error) {
        console.warn('CSS validation error:', error);
        valid = true; // Assume valid if validation fails
      }
    }

    // Find all properties with the same name (excluding the current one)
    const duplicateProperties = currentRule.properties.filter(
      p => p.id !== propertyId && p.name.trim() === property.name.trim()
    );

    if (duplicateProperties.length > 0) {
      // Only disable existing properties if the new property is valid
      if (valid) {
        // Disable all duplicate properties
        const updatedRules = cssRules.map(rule =>
          rule.id === currentRule.id
            ? {
                ...rule,
                properties: rule.properties.map(prop => {
                  if (prop.id === propertyId) {
                    // Update the current property with validation result
                    return { ...prop, enabled: valid };
                  } else if (
                    duplicateProperties.some(dp => dp.id === prop.id)
                  ) {
                    // Disable duplicate properties only if new property is valid
                    return { ...prop, enabled: false };
                  }
                  return prop;
                }),
              }
            : rule
        );
        setCssRules(updatedRules);
      } else {
        // If new property is invalid, keep existing properties active
        // and disable the new invalid property
        const updatedRules = cssRules.map(rule =>
          rule.id === currentRule.id
            ? {
                ...rule,
                properties: rule.properties.map(prop => {
                  if (prop.id === propertyId) {
                    // Disable the invalid new property
                    return { ...prop, enabled: false };
                  }
                  // Keep existing properties active
                  return prop;
                }),
              }
            : rule
        );
        setCssRules(updatedRules);
      }
    } else {
      // No duplicates, just update the current property with validation result
      const updatedRules = cssRules.map(rule =>
        rule.id === currentRule.id
          ? {
              ...rule,
              properties: rule.properties.map(prop => {
                if (prop.id === propertyId) {
                  return { ...prop, enabled: valid };
                }
                return prop;
              }),
            }
          : rule
      );
      setCssRules(updatedRules);
    }
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
      // Convert kebab-case CSS property names to camelCase for the Node type
      const camelCaseKey = property.name
        ? property.name.replace(/-([a-z])/g, (_, letter) =>
            letter.toUpperCase()
          )
        : undefined;

      onChange({
        nodeId: node.id,
        oldKey: camelCaseKey,
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
                    onConfirmChange={handleDuplicateProperties}
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
