// Common constants used throughout the application

// Event names
export const EVENTS = {
  FOCUS_EMPTY_PROPERTY: 'focusEmptyProperty',
} as const;

// CSS property types
export const CSS_PROPERTY_TYPES = {
  LAYOUT: 'layout',
  BOX_MODEL: 'box-model',
  TYPOGRAPHY: 'typography',
  VISUAL: 'visual',
  ANIMATION: 'animation',
  FLEXBOX: 'flexbox',
  GRID: 'grid',
  OTHER: 'other',
} as const;

// Node types
export const NODE_TYPES = {
  DIV: 'Div',
  IMAGE: 'Image',
  INPUT: 'Input',
  BUTTON: 'Button',
} as const;

// Component label format
export const COMPONENT_LABEL_FORMAT = {
  PREFIX: 'C',
  START_NUMBER: 1,
} as const;

// Input field settings
export const INPUT_SETTINGS = {
  MIN_WIDTH: 3,
  WIDTH_PADDING: 2,
  FOCUS_DELAY: 100,
  BLUR_DELAY: 150,
} as const;

// Z-index values
export const Z_INDEX = {
  SUGGESTIONS_DROPDOWN: 50,
  MODAL: 1000,
  TOOLTIP: 2000,
} as const;
