import { CSSProperties } from 'react';

export type NodeType = 'Div' | 'Input' | 'Image' | 'Button';

export type Node = {
  id: string;
  x: number;
  y: number;
  name: string;
  type: NodeType;
  width: number;
  height: number;

  // Layout properties
  display?: CSSProperties['display'];
  position?: CSSProperties['position'];
  zIndex?: CSSProperties['zIndex'];

  // Box model properties
  margin?: CSSProperties['margin'];
  padding?: CSSProperties['padding'];
  border?: CSSProperties['border'];
  borderRadius?: CSSProperties['borderRadius'];

  // Visual properties
  background?: CSSProperties['background'];
  color?: CSSProperties['color'];
  fontSize?: CSSProperties['fontSize'];
  fontFamily?: CSSProperties['fontFamily'];
  fontWeight?: CSSProperties['fontWeight'];
  textAlign?: CSSProperties['textAlign'];

  // Content
  text?: string;

  // Children and styles
  children: Node[];
  styles?: CSSProperties; // now typed to actual CSS keys
};

export type ComponentLabels = Record<string, string>;
