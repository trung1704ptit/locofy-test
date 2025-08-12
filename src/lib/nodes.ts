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
  const structureGroups = new Map<string, string[]>(); // sig -> node ids

  // Create a unique "signature" for the node's structure
  const getStructureSignature = (node: Node): string => {
    const childrenSig = (node.children || [])
      .map(getStructureSignature)
      .join('|');
    return `${node.type}(${childrenSig})`;
  };

  // Collect only nodes WITH children
  const collect = (nodes: Node[]) => {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        const sig = getStructureSignature(node);
        if (!structureGroups.has(sig)) {
          structureGroups.set(sig, []);
        }
        structureGroups.get(sig)!.push(node.id);

        collect(node.children);
      } else {
        // Still traverse in case children deeper match
        if (node.children && node.children.length > 0) {
          collect(node.children);
        }
      }
    }
  };

  collect(nodes);

  // Assign labels only for groups with duplicates
  for (const [, ids] of structureGroups) {
    if (ids.length > 1) {
      const label = `C${counter++}`;
      ids.forEach(id => {
        nodeIdToLabel[id] = label;
      });
    }
  }

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
    ...(node.styles || {}),
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
