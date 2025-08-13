import type { Node } from '../../types';
import {
  computeComponentLabels,
  findNodeById,
  nodeToStyle,
  updateNodeById,
} from '../nodes';

describe('nodes utility functions', () => {
  const mockNodes: Node[] = [
    {
      id: 'root-1',
      name: 'Root',
      type: 'Div',
      x: 20,
      y: 20,
      width: 760,
      height: 520,
      background: '#ffffff',
      border: '1px solid #ddd',
      children: [
        {
          id: 'text-1',
          name: 'Text 1',
          type: 'Div',
          x: 40,
          y: 40,
          width: 100,
          height: 24,
          text: 'Text 1',
          children: [],
        },
        {
          id: 'node-3',
          name: 'Node 3',
          type: 'Div',
          x: 40,
          y: 220,
          width: 560,
          height: 160,
          background: '#16a34a',
          children: [
            {
              id: 'btn-1',
              name: 'Button 1',
              type: 'Button',
              x: 90,
              y: 260,
              width: 180,
              height: 44,
              background: '#0ea5e9',
              color: '#fff',
              text: 'Button 1',
              children: [],
            },
          ],
        },
      ],
    },
  ];

  describe('findNodeById', () => {
    it('should find a node by its ID', () => {
      const foundNode = findNodeById(mockNodes, 'btn-1');
      expect(foundNode).toBeDefined();
      expect(foundNode?.name).toBe('Button 1');
      expect(foundNode?.type).toBe('Button');
    });

    it('should return undefined for non-existent ID', () => {
      const foundNode = findNodeById(mockNodes, 'non-existent');
      expect(foundNode).toBeUndefined();
    });

    it('should find nested nodes', () => {
      const foundNode = findNodeById(mockNodes, 'node-3');
      expect(foundNode).toBeDefined();
      expect(foundNode?.name).toBe('Node 3');
      expect(foundNode?.children).toHaveLength(1);
    });
  });

  describe('updateNodeById', () => {
    it('should update a node by its ID', () => {
      const updatedNodes = updateNodeById(mockNodes, 'btn-1', node => ({
        ...node,
        background: '#ff0000',
      }));

      const updatedNode = findNodeById(updatedNodes, 'btn-1');
      expect(updatedNode?.background).toBe('#ff0000');
    });

    it('should not modify other nodes', () => {
      const originalBackground =
        mockNodes[0].children[1].children[0].background;
      const updatedNodes = updateNodeById(mockNodes, 'text-1', node => ({
        ...node,
        text: 'Updated Text',
      }));

      const unchangedNode = findNodeById(updatedNodes, 'btn-1');
      expect(unchangedNode?.background).toBe(originalBackground);
    });
  });

  describe('computeComponentLabels', () => {
    it('should assign component labels to nodes with children', () => {
      const labels = computeComponentLabels(mockNodes);

      // Root should have a label
      expect(labels['root-1']).toBeDefined();

      // Node 3 should have a label
      expect(labels['node-3']).toBeDefined();

      // Text 1 should not have a label (no children)
      expect(labels['text-1']).toBeUndefined();

      // Button 1 should not have a label (no children)
      expect(labels['btn-1']).toBeUndefined();
    });

    it('should assign different labels to different levels', () => {
      const labels = computeComponentLabels(mockNodes);

      const rootLabel = labels['root-1'];
      const node3Label = labels['node-3'];

      expect(rootLabel).not.toBe(node3Label);
    });
  });

  describe('nodeToStyle', () => {
    it('should convert node properties to CSS styles', () => {
      const node = mockNodes[0].children[1].children[0]; // Button 1
      const styles = nodeToStyle(node);

      expect(styles.position).toBe('absolute');
      expect(styles.left).toBe(90);
      expect(styles.top).toBe(260);
      expect(styles.width).toBe(180);
      expect(styles.height).toBe(44);
      expect(styles.background).toBe('#0ea5e9');
      expect(styles.color).toBe('#fff');
    });

    it('should apply default styles for Button type', () => {
      const node = mockNodes[0].children[1].children[0]; // Button 1
      const styles = nodeToStyle(node);

      expect(styles.borderRadius).toBe(8);
    });

    it('should apply default styles for Div type', () => {
      const node = mockNodes[0].children[1]; // Node 3
      const styles = nodeToStyle(node);

      expect(styles.borderRadius).toBe(8);
      expect(styles.padding).toBe(8);
    });
  });
});
