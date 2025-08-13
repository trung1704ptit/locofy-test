import type { Node } from '../../types';
import { mockNodes } from '../mockNodes';

describe('mockNodes data', () => {
  it('should have valid structure', () => {
    expect(Array.isArray(mockNodes)).toBe(true);
    expect(mockNodes).toHaveLength(1);
  });

  it('should have root node with correct properties', () => {
    const root = mockNodes[0];
    expect(root.id).toBe('root-1');
    expect(root.name).toBe('Root');
    expect(root.type).toBe('Div');
    expect(root.children).toBeDefined();
    expect(Array.isArray(root.children)).toBe(true);
  });

  it('should have valid child nodes', () => {
    const root = mockNodes[0];
    const children = root.children;

    // Check Text 1
    const text1 = children.find(child => child.id === 'text-1');
    expect(text1).toBeDefined();
    expect(text1?.type).toBe('Div');
    expect(text1?.text).toBe('Text 1');
    expect(text1?.children).toHaveLength(0);

    // Check Text 2
    const text2 = children.find(child => child.id === 'text-2');
    expect(text2).toBeDefined();
    expect(text2?.type).toBe('Div');
    expect(text2?.background).toBe('#f4c23a');

    // Check Node 3
    const node3 = children.find(child => child.id === 'node-3');
    expect(node3).toBeDefined();
    expect(node3?.type).toBe('Div');
    expect(node3?.background).toBe('#16a34a');
    expect(node3?.children).toHaveLength(2); // Button 1 and Image 1

    // Check Node 4
    const node4 = children.find(child => child.id === 'node-4');
    expect(node4).toBeDefined();
    expect(node4?.type).toBe('Div');
    expect(node4?.background).toBe('#16a34a');
    expect(node4?.children).toHaveLength(2); // Button 2 and Image 2
  });

  it('should have valid nested nodes', () => {
    const root = mockNodes[0];
    const node3 = root.children.find(child => child.id === 'node-3')!;
    const node4 = root.children.find(child => child.id === 'node-4')!;

    // Check Node 3 children
    const btn1 = node3.children.find(child => child.id === 'btn-1');
    expect(btn1).toBeDefined();
    expect(btn1?.type).toBe('Button');
    expect(btn1?.background).toBe('#0ea5e9');

    const img1 = node3.children.find(child => child.id === 'img-1');
    expect(img1).toBeDefined();
    expect(img1?.type).toBe('Image');

    // Check Node 4 children
    const btn2 = node4.children.find(child => child.id === 'btn-2');
    expect(btn2).toBeDefined();
    expect(btn2?.type).toBe('Button');

    const img2 = node4.children.find(child => child.id === 'img-2');
    expect(img2).toBeDefined();
    expect(img2?.type).toBe('Image');
  });

  it('should have consistent positioning and sizing', () => {
    const root = mockNodes[0];

    // Check that all nodes have valid dimensions
    const checkNodeDimensions = (node: Node) => {
      expect(typeof node.x).toBe('number');
      expect(typeof node.y).toBe('number');
      expect(typeof node.width).toBe('number');
      expect(typeof node.height).toBe('number');
      expect(node.width).toBeGreaterThan(0);
      expect(node.height).toBeGreaterThan(0);

      // Recursively check children
      node.children.forEach(checkNodeDimensions);
    };

    checkNodeDimensions(root);
  });

  it('should have unique IDs', () => {
    const allIds = new Set<string>();

    const collectIds = (nodes: Node[]) => {
      nodes.forEach(node => {
        expect(allIds.has(node.id)).toBe(false);
        allIds.add(node.id);
        if (node.children && node.children.length > 0) {
          collectIds(node.children);
        }
      });
    };

    collectIds(mockNodes);
  });
});
