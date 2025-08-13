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
  display?: CSSProperties['display'];
  position?: CSSProperties['position'];
  text?: string;
  zIndex?: CSSProperties['zIndex'];
  margin?: CSSProperties['margin'];
  padding?: CSSProperties['padding'];
  border?: CSSProperties['border'];
  borderRadius?: CSSProperties['borderRadius'];
  background?: CSSProperties['background'];
  color?: CSSProperties['color'];
  fontSize?: CSSProperties['fontSize'];
  fontFamily?: CSSProperties['fontFamily'];
  fontWeight?: CSSProperties['fontWeight'];
  textAlign?: CSSProperties['textAlign'];
  children: Node[];
};

export type ComponentLabels = Record<string, string>;

export type KeyValue = {
  key: string;
  value: string;
};
