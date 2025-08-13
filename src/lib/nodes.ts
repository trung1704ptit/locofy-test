import { COMPONENT_LABEL_FORMAT } from '@/constants';
import type { Node } from '@/types';
import type { CSSProperties } from 'react';

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
  let counter = COMPONENT_LABEL_FORMAT.START_NUMBER;

  const getStructureSignature = (node: Node): string => {
    if (!node.children || node.children.length === 0) return '';
    const childCounts = new Map<string, number>();
    node.children.forEach(child => {
      childCounts.set(child.type, (childCounts.get(child.type) || 0) + 1);
    });
    const childSignature = Array.from(childCounts.entries())
      .map(([type, count]) => `${type}:${count}`)
      .sort()
      .join('|');
    return `${node.type}=>[${childSignature}]`;
  };

  const levelGroups = new Map<number, Map<string, string[]>>();

  const traverseWithLevel = (nodes: Node[], level: number = 0) => {
    if (level === 0) {
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          traverseWithLevel(node.children, level + 1);
        }
      });
      return;
    }

    const levelNodes = new Map<string, string[]>();
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        const signature = getStructureSignature(node);
        if (!levelNodes.has(signature)) {
          levelNodes.set(signature, []);
        }
        levelNodes.get(signature)!.push(node.id);
        traverseWithLevel(node.children, level + 1);
      } else {
        if (node.children && node.children.length > 0) {
          traverseWithLevel(node.children, level + 1);
        }
      }
    }
    if (levelNodes.size > 0) {
      levelGroups.set(level, levelNodes);
    }
  };

  traverseWithLevel(nodes);

  levelGroups.forEach(levelGroup => {
    levelGroup.forEach(nodeIds => {
      const label = `${COMPONENT_LABEL_FORMAT.PREFIX}${counter++}`;
      nodeIds.forEach(nodeId => {
        nodeIdToLabel[nodeId] = label;
      });
    });
  });
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
