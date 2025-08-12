import { useMemo, useState, useEffect } from 'react'
import type { Node } from '../types'
import { findNodeById } from '../lib/nodes'

type Props = {
  nodes: Node[]
  selectedId?: string
  onChange: (nodeId: string, key: string, value: string) => void
}

type CssRule = {
  id: string
  selector: string
  properties: CssProperty[]
}

type CssProperty = {
  id: string
  name: string
  value: string
  enabled: boolean
}

export default function CssInspector({ nodes, selectedId, onChange }: Props) {
  const node = useMemo(() => (selectedId ? findNodeById(nodes, selectedId) : undefined), [nodes, selectedId])
  const [cssRules, setCssRules] = useState<CssRule[]>([])
  const [newProperty, setNewProperty] = useState('')
  const [newValue, setNewValue] = useState('')

  // Initialize CSS rules for the selected node if none exist
  const shouldInitializeRules = useMemo(() => {
    return selectedId && !cssRules.find(rule => rule.selector.includes(selectedId))
  }, [selectedId, cssRules])

  // Initialize rules when needed
  useEffect(() => {
    if (shouldInitializeRules && node) {
      const defaultRule: CssRule = {
        id: `rule-${selectedId}`,
        selector: `#${selectedId}`,
        properties: [
          { id: 'prop-1', name: 'display', value: node.display || 'block', enabled: true },
          { id: 'prop-2', name: 'width', value: `${node.width}px`, enabled: true },
          { id: 'prop-3', name: 'height', value: `${node.height}px`, enabled: true },
          { id: 'prop-4', name: 'background', value: node.background || 'transparent', enabled: true },
          { id: 'prop-5', name: 'color', value: node.color || '#000000', enabled: true },
          { id: 'prop-6', name: 'border', value: node.border || 'none', enabled: true },
          { id: 'prop-7', name: 'position', value: 'absolute', enabled: true },
          { id: 'prop-8', name: 'left', value: `${node.x}px`, enabled: true },
          { id: 'prop-9', name: 'top', value: `${node.y}px`, enabled: true },
        ]
      }
      setCssRules([defaultRule])
    }
  }, [shouldInitializeRules, node, selectedId])

  const currentRule = useMemo(() => 
    cssRules.find(rule => rule.selector.includes(selectedId || '')), 
    [cssRules, selectedId]
  )

  const handlePropertyChange = (propertyId: string, newValue: string) => {
    if (!currentRule || !node) return
    
    const updatedRules = cssRules.map(rule => {
      if (rule.id === currentRule.id) {
        return {
          ...rule,
          properties: rule.properties.map(prop => 
            prop.id === propertyId ? { ...prop, value: newValue } : prop
          )
        }
      }
      return rule
    })
    
    setCssRules(updatedRules)
    
    // Apply the change to the node
    const property = currentRule.properties.find(p => p.id === propertyId)
    if (property) {
      onChange(node.id, property.name, newValue)
    }
  }

  const handlePropertyToggle = (propertyId: string) => {
    if (!currentRule || !node) return
    
    const updatedRules = cssRules.map(rule => {
      if (rule.id === currentRule.id) {
        return {
          ...rule,
          properties: rule.properties.map(prop => 
            prop.id === propertyId ? { ...prop, enabled: !prop.enabled } : prop
          )
        }
      }
      return rule
    })
    
    setCssRules(updatedRules)
    
    // Apply the change to the node
    const property = currentRule.properties.find(p => p.id === propertyId)
    if (property) {
      if (property.enabled) {
        // Disable the property
        onChange(node.id, property.name, '')
      } else {
        // Enable the property
        onChange(node.id, property.name, property.value)
      }
    }
  }

  const addNewProperty = () => {
    if (!currentRule || !newProperty.trim() || !newValue.trim() || !node) return
    
    const newProp: CssProperty = {
      id: `prop-${Date.now()}`,
      name: newProperty.trim(),
      value: newValue.trim(),
      enabled: true
    }
    
    const updatedRules = cssRules.map(rule => {
      if (rule.id === currentRule.id) {
        return {
          ...rule,
          properties: [...rule.properties, newProp]
        }
      }
      return rule
    })
    
    setCssRules(updatedRules)
    onChange(node.id, newProp.name, newProp.value)
    setNewProperty('')
    setNewValue('')
  }

  const deleteProperty = (propertyId: string) => {
    if (!currentRule || !node) return
    
    const property = currentRule.properties.find(p => p.id === propertyId)
    if (property) {
      onChange(node.id, property.name, '')
    }
    
    const updatedRules = cssRules.map(rule => {
      if (rule.id === currentRule.id) {
        return {
          ...rule,
          properties: rule.properties.filter(p => p.id !== propertyId)
        }
      }
      return rule
    })
    
    setCssRules(updatedRules)
  }

  const updateSelector = (newSelectorValue: string) => {
    if (!currentRule) return
    
    const updatedRules = cssRules.map(rule => {
      if (rule.id === currentRule.id) {
        return { ...rule, selector: newSelectorValue }
      }
      return rule
    })
    
    setCssRules(updatedRules)
  }


  if (!node) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-lg mb-2">Select an element</div>
          <div className="text-sm">Choose an element from the tree to inspect its styles</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-gray-900">CSS Inspector</div>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {node.type}
          </div>
        </div>
        <div className="text-sm text-gray-600 mb-3">{node.name}</div>
        
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-3">
          {currentRule && (
            <>
              {/* CSS Rule Header */}
              <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">Selector:</span>
                  <input
                    type="text"
                    value={currentRule.selector}
                    onChange={(e) => updateSelector(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., #id, .class, element"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  Use #id for IDs, .class for classes, or element names
                </div>
              </div>

              {/* CSS Properties */}
              <div className="space-y-2 mb-4">
                {currentRule.properties.map((prop) => (
                  <div key={prop.id} className="group hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 transition-colors">
                    <div className="p-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={prop.enabled}
                          onChange={() => handlePropertyToggle(prop.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1 min-w-0 flex">
                          <div className="flex items-center gap-2 mb-2">
                            <span 
                              className={`font-mono text-sm ${
                                prop.enabled ? 'text-blue-700' : 'text-gray-400 line-through'
                              }`}
                            >
                              {prop.name}
                            </span>
                            <span className="text-gray-400">:</span>
                          </div>
                          <input
                            type="text"
                            value={prop.value}
                            onChange={(e) => handlePropertyChange(prop.id, e.target.value)}
                            className={`w-full px-3 py-2 w-auto text-sm border-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono ${
                              prop.enabled ? '' : 'opacity-50'
                            }`}
                            disabled={!prop.enabled}
                          />
                        </div>
                        <button
                          onClick={() => deleteProperty(prop.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition-all"
                          title="Delete property"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Property */}
              <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
                <div className="text-sm font-medium text-gray-700 mb-2">Add new property</div>
                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    placeholder="property"
                    value={newProperty}
                    onChange={(e) => setNewProperty(e.target.value)}
                    className="px-2 w-[32%] py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="px-2 w-[32%] py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={addNewProperty}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* CSS Preview */}
              <div className="mt-4 p-3 bg-gray-900 text-green-400 rounded-md">
                <div className="text-xs font-mono">
                  <div>{currentRule.selector} {'{'}</div>
                  {currentRule.properties.map(prop => (
                    <div key={prop.id} className={`ml-4 ${prop.enabled ? '' : 'line-through opacity-50'}`}>
                      &nbsp;&nbsp;{prop.name}: {prop.value};
                    </div>
                  ))}
                  <div>{'}'}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}


