import { useEffect, useMemo, useState } from 'react';
import { findNodeById } from '../../lib/nodes';
import type { Node } from '../../types';
import { PropertyInputRow } from './../PropertyInputRow';

// CSS Property Suggestions
const CSS_PROPERTIES = [
  // Layout
  'display',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'z-index',
  'float',
  'clear',
  'overflow',
  'overflow-x',
  'overflow-y',
  'clip',
  'zoom',
  'table-layout',
  'empty-cells',
  'caption-side',
  'vertical-align',
  'text-align',
  'direction',
  'unicode-bidi',

  // Box Model
  'width',
  'height',
  'min-width',
  'min-height',
  'max-width',
  'max-height',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'border',
  'border-width',
  'border-style',
  'border-color',
  'border-top',
  'border-right',
  'border-bottom',
  'border-left',
  'border-radius',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-right-radius',
  'border-bottom-left-radius',
  'box-sizing',
  'box-shadow',
  'outline',
  'outline-width',
  'outline-style',
  'outline-color',
  'outline-offset',

  // Typography
  'font',
  'font-family',
  'font-size',
  'font-style',
  'font-variant',
  'font-weight',
  'font-stretch',
  'font-size-adjust',
  'line-height',
  'text-decoration',
  'text-decoration-color',
  'text-decoration-line',
  'text-decoration-style',
  'text-decoration-skip',
  'text-underline-position',
  'text-indent',
  'text-transform',
  'text-shadow',
  'text-align-last',
  'text-justify',
  'word-spacing',
  'letter-spacing',
  'white-space',
  'word-break',
  'word-wrap',
  'overflow-wrap',
  'text-overflow',

  // Visual
  'color',
  'background',
  'background-color',
  'background-image',
  'background-repeat',
  'background-attachment',
  'background-position',
  'background-size',
  'background-clip',
  'background-origin',
  'opacity',
  'filter',
  'backdrop-filter',
  'mix-blend-mode',
  'isolation',
  'transform',
  'transform-origin',
  'transform-style',
  'perspective',
  'perspective-origin',
  'backface-visibility',

  // Animation
  'transition',
  'transition-property',
  'transition-duration',
  'transition-timing-function',
  'transition-delay',
  'animation',
  'animation-name',
  'animation-duration',
  'animation-timing-function',
  'animation-delay',
  'animation-iteration-count',
  'animation-direction',
  'animation-fill-mode',
  'animation-play-state',

  // Flexbox
  'flex',
  'flex-grow',
  'flex-shrink',
  'flex-basis',
  'flex-direction',
  'flex-wrap',
  'flex-flow',
  'justify-content',
  'align-items',
  'align-self',
  'align-content',
  'order',

  // Grid
  'grid',
  'grid-template',
  'grid-template-rows',
  'grid-template-columns',
  'grid-template-areas',
  'grid-row',
  'grid-row-start',
  'grid-row-end',
  'grid-column',
  'grid-column-start',
  'grid-column-end',
  'grid-area',
  'grid-gap',
  'grid-row-gap',
  'grid-column-gap',
  'justify-items',
  'justify-self',
  'align-items',
  'align-self',

  // Other
  'cursor',
  'pointer-events',
  'user-select',
  'resize',
  'content',
  'quotes',
  'counter-reset',
  'counter-increment',
  'list-style',
  'list-style-type',
  'list-style-position',
  'list-style-image',
  'table-border-collapse',
  'table-border-spacing',
  'table-caption-side',
  'table-empty-cells',
  'table-layout',
];

// CSS Value Suggestions for common properties
const CSS_VALUES: Record<string, string[]> = {
  display: [
    'block',
    'inline',
    'inline-block',
    'flex',
    'grid',
    'none',
    'table',
    'table-cell',
    'table-row',
    'contents',
  ],
  position: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
  float: ['left', 'right', 'none'],
  clear: ['left', 'right', 'both', 'none'],
  overflow: ['visible', 'hidden', 'scroll', 'auto', 'clip'],
  'text-align': ['left', 'right', 'center', 'justify', 'start', 'end'],
  'vertical-align': [
    'baseline',
    'sub',
    'super',
    'top',
    'text-top',
    'middle',
    'bottom',
    'text-bottom',
  ],
  'font-weight': [
    'normal',
    'bold',
    'bolder',
    'lighter',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
  ],
  'font-style': ['normal', 'italic', 'oblique'],
  'text-transform': [
    'none',
    'capitalize',
    'uppercase',
    'lowercase',
    'full-width',
  ],
  'text-decoration': ['none', 'underline', 'overline', 'line-through', 'blink'],
  'white-space': [
    'normal',
    'nowrap',
    'pre',
    'pre-wrap',
    'pre-line',
    'break-spaces',
  ],
  'word-break': [
    'normal',
    'break-all',
    'keep-all',
    'break-word',
    'break-spaces',
  ],
  cursor: [
    'auto',
    'default',
    'pointer',
    'text',
    'wait',
    'move',
    'not-allowed',
    'help',
    'crosshair',
    'grab',
    'grabbing',
  ],
  'border-style': [
    'none',
    'hidden',
    'dotted',
    'dashed',
    'solid',
    'double',
    'groove',
    'ridge',
    'inset',
    'outset',
  ],
  'box-sizing': ['content-box', 'border-box'],
  'flex-direction': ['row', 'row-reverse', 'column', 'column-reverse'],
  'flex-wrap': ['nowrap', 'wrap', 'wrap-reverse'],
  'justify-content': [
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
    'space-evenly',
  ],
  'align-items': ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
  'align-self': [
    'auto',
    'stretch',
    'flex-start',
    'flex-end',
    'center',
    'baseline',
  ],
  'grid-template-columns': [
    'none',
    'auto',
    '1fr',
    'repeat()',
    'minmax()',
    'fit-content()',
  ],
  'grid-template-rows': [
    'none',
    'auto',
    '1fr',
    'repeat()',
    'minmax()',
    'fit-content()',
  ],
  'transition-timing-function': [
    'ease',
    'linear',
    'ease-in',
    'ease-out',
    'ease-in-out',
    'cubic-bezier()',
    'steps()',
  ],
  'animation-timing-function': [
    'ease',
    'linear',
    'ease-in',
    'ease-out',
    'ease-in-out',
    'cubic-bezier()',
    'steps()',
  ],
};

// Common CSS units and values
const COMMON_VALUES = [
  'auto',
  'none',
  'inherit',
  'initial',
  'unset',
  'revert',
  '0',
  '1px',
  '2px',
  '4px',
  '8px',
  '16px',
  '32px',
  '64px',
  '1em',
  '1.5em',
  '2em',
  '0.5em',
  '0.75em',
  '1rem',
  '1.5rem',
  '2rem',
  '0.5rem',
  '0.75rem',
  '1%',
  '50%',
  '100%',
  '25%',
  '75%',
  'transparent',
  'currentColor',
  'inherit',
  '#000000',
  '#ffffff',
  '#ff0000',
  '#00ff00',
  '#0000ff',
  'rgb(0,0,0)',
  'rgba(0,0,0,0.5)',
  'hsl(0,0%,0%)',
  'hsla(0,0%,0%,0.5)',
];

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

    // Validate the property when value changes
    const valid =
      property?.name.trim() && newValue.trim()
        ? CSS.supports(property.name, newValue)
        : true;

    const updatedRules = cssRules.map(rule =>
      rule.id === currentRule.id
        ? {
            ...rule,
            properties: rule.properties.map(prop =>
              prop.id === propertyId
                ? { ...prop, value: newValue, enabled: valid }
                : prop
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

    // Only validate if both name and value are present
    const valid =
      newName.trim() && property.value.trim()
        ? CSS.supports(newName, property.value)
        : true;

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

  const addNewProperty = () => {
    if (!currentRule || !node) return;

    // Check if there's already an empty property form
    const hasEmptyProperty = currentRule.properties.some(
      prop => !prop.name.trim() && !prop.value.trim()
    );

    if (hasEmptyProperty) {
      return; // Don't add another empty property if one already exists
    }

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
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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
