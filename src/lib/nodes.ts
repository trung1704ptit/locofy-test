import type { CSSProperties } from 'react';
import type { Node } from '../types';

export function traverse(
  nodes: Node[],
  visit: (node: Node, parentId?: string) => void,
  parentId?: string
) {
  for (const node of nodes) {
    visit(node, parentId);
    if (node.children && node.children.length > 0) {
      traverse(node.children, visit, node.id);
    }
  }
}

export function findNodeById(nodes: Node[], id: string): Node | undefined {
  let result: Node | undefined;
  traverse(nodes, node => {
    if (node.id === id) result = node;
  });
  return result;
}

export function updateNodeById(
  nodes: Node[],
  id: string,
  updater: (n: Node) => Node
): Node[] {
  return nodes.map(n => {
    if (n.id === id) {
      return updater({ ...n });
    }
    if (n.children?.length) {
      return { ...n, children: updateNodeById(n.children, id, updater) };
    }
    return n;
  });
}

export function computeComponentLabels(nodes: Node[]): Record<string, string> {
  const nodeIdToLabel: Record<string, string> = {};
  let counter = 1;

  // Collect all nodes with children and assign labels
  const collect = (nodes: Node[]) => {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        // Assign label to this node
        nodeIdToLabel[node.id] = `C${counter++}`;

        // Continue traversing children
        collect(node.children);
      }
    }
  };

  collect(nodes);

  return nodeIdToLabel;
}

export function nodeToStyle(node: Node): CSSProperties {
  const style: CSSProperties = {
    position: 'absolute',
    left: node.x,
    top: node.y,
    width: node.width,
    height: node.height,
    display: node.display,
    background: node.background,
    color: node.color,
    border: node.border,
    boxSizing: 'border-box',
  };

  if (node.type === 'Div') {
    if (node.text) {
      style.display = style.display || 'flex';
      style.alignItems = style.alignItems || 'center';
      style.justifyContent = style.justifyContent || 'center';
    }
    if (style.borderRadius === undefined) {
      style.borderRadius = 8;
    }
    style.padding = style.padding ?? 8;
  }

  if (node.type === 'Button' || node.type === 'Image') {
    if (style.borderRadius === undefined) {
      style.borderRadius = 8;
    }
  }

  return style;
}
