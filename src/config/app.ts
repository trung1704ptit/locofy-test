// App-wide configuration
export const APP_CONFIG = {
  // CSS Inspector settings
  cssInspector: {
    // Delay for auto-focus after adding new property (ms)
    focusDelay: 100,
    // Delay for blur events to allow clicking suggestions (ms)
    blurDelay: 150,
    // Minimum width for property inputs (characters)
    minInputWidth: 3,
    // Width padding for property inputs (characters)
    inputWidthPadding: 2,
  },

  // Tree View settings
  treeView: {
    // Component label prefix
    componentLabelPrefix: 'C',
    // Whether to show component labels
    showComponentLabels: true,
  },

  // Canvas Preview settings
  canvasPreview: {
    // Default zoom level
    defaultZoom: 1,
    // Min/max zoom levels
    minZoom: 0.1,
    maxZoom: 3,
    // Zoom step
    zoomStep: 0.1,
  },

  // Development settings
  dev: {
    // Enable console logging
    enableConsoleLogs: true,
    // Enable debugging
    enableDebugging: true,
  },
} as const;

// Type for the config
export type AppConfig = typeof APP_CONFIG;
