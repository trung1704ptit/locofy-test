# Project Structure

This document describes the restructured project organization with centralized configuration and constants.

## 📁 Directory Structure

```
src/
├── components/           # React components
│   ├── CanvasPreview/   # Canvas preview component
│   ├── CssInspector/    # CSS inspector component
│   ├── PropertyInputRow/ # Property input row component
│   └── TreeView/        # Tree view component
├── config/              # Configuration files
│   └── app.ts          # App-wide configuration
├── constants/           # Constants and enums
│   ├── css.ts          # CSS-related constants
│   ├── common.ts       # Common constants
│   └── index.ts        # Main export file
├── data/               # Mock data and test data
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
└── main.tsx           # Main entry point
```

## ⚙️ Configuration (`src/config/`)

### `app.ts`

Contains app-wide configuration settings:

- **CSS Inspector**: Focus delays, input widths, blur delays
- **Tree View**: Component label settings
- **Canvas Preview**: Zoom levels and steps
- **Development**: Console logging and debugging flags

```typescript
import { APP_CONFIG } from '../constants';

// Usage example
const focusDelay = APP_CONFIG.cssInspector.focusDelay;
const maxZoom = APP_CONFIG.canvasPreview.maxZoom;
```

## 🎯 Constants (`src/constants/`)

### `css.ts`

CSS-related constants:

- `CSS_PROPERTIES`: Array of all CSS property names
- `CSS_VALUES`: CSS value suggestions for specific properties
- `COMMON_VALUES`: Common CSS units, colors, and values

### `common.ts`

Shared constants:

- `EVENTS`: Custom event names
- `CSS_PROPERTY_TYPES`: CSS property categories
- `NODE_TYPES`: Available node types
- `COMPONENT_LABEL_FORMAT`: Component labeling format
- `INPUT_SETTINGS`: Input field configuration
- `Z_INDEX`: Z-index values for layering

### `index.ts`

Main export file that re-exports all constants:

```typescript
import { CSS_PROPERTIES, EVENTS, APP_CONFIG } from '../constants';
```

## 🔧 Usage Examples

### Using Configuration

```typescript
import { APP_CONFIG } from '../constants';

// Set focus delay
setTimeout(() => {
  // Focus logic
}, APP_CONFIG.cssInspector.focusDelay);

// Check zoom limits
const newZoom = Math.min(
  zoom + APP_CONFIG.canvasPreview.zoomStep,
  APP_CONFIG.canvasPreview.maxZoom
);
```

### Using Constants

```typescript
import { EVENTS, Z_INDEX } from '../constants';

// Dispatch custom event
const event = new CustomEvent(EVENTS.FOCUS_EMPTY_PROPERTY, {
  detail: { propertyId }
});

// Set z-index
style={{ zIndex: Z_INDEX.SUGGESTIONS_DROPDOWN }}
```

### Using CSS Constants

```typescript
import { CSS_PROPERTIES, CSS_VALUES, COMMON_VALUES } from '../constants';

// Get suggestions for a property
const suggestions = CSS_VALUES[propertyName] || COMMON_VALUES;

// Check if property exists
const isValidProperty = CSS_PROPERTIES.includes(propertyName);
```

## 🚀 Benefits of Restructuring

1. **Centralized Configuration**: All settings in one place
2. **Easy Maintenance**: Update values in one location
3. **Type Safety**: TypeScript ensures correct usage
4. **Consistency**: Same values used across components
5. **Scalability**: Easy to add new constants and config
6. **Documentation**: Self-documenting code structure

## 📝 Adding New Constants

1. **Add to appropriate file** in `src/constants/`
2. **Export from** `src/constants/index.ts`
3. **Import and use** in components
4. **Update this documentation** if needed

## 🔄 Migration Notes

- Old hardcoded values have been replaced with constants
- Configuration values are now centralized and configurable
- Event names are standardized and reusable
- Z-index values are organized and documented
