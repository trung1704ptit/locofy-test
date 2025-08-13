import { mockNodes } from '../../data/mockNodes';
import type { Node } from '../../types';
import {
  computeComponentLabels,
  findNodeById,
  nodeToStyle,
  updateNodeById,
} from '../nodes';

describe('nodes utility functions', () => {
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
      expect(foundNode?.children).toHaveLength(2); // Button 1 and Image 1
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
        mockNodes[0].children[2].children[0].background; // Node 3 -> Button 1
      const updatedNodes = updateNodeById(mockNodes, 'text-1', node => ({
        ...node,
        text: 'Updated Text',
      }));

      const unchangedNode = findNodeById(updatedNodes, 'btn-1');
      expect(unchangedNode?.background).toBe(originalBackground);
    });
  });

  describe('computeComponentLabels', () => {
    it('should not assign labels to root level', () => {
      const labels = computeComponentLabels(mockNodes);

      // Root should NOT have a label (level 0 is skipped)
      expect(labels['root-1']).toBeUndefined();
    });

    it('should assign component labels to nodes with children at non-root levels', () => {
      const labels = computeComponentLabels(mockNodes);

      // Node 3 should have a label (level 1)
      expect(labels['node-3']).toBeDefined();

      // Text 1 should not have a label (no children)
      expect(labels['text-1']).toBeUndefined();

      // Button 1 should not have a label (no children)
      expect(labels['btn-1']).toBeUndefined();
    });

    it('should assign same labels to nodes with similar structure at the same level', () => {
      const labels = computeComponentLabels(mockNodes);

      const node3Label = labels['node-3'];
      const node4Label = labels['node-4'];

      // Node 3 and Node 4 should have the same label since they have similar structure
      // Both have: 1 Button + 1 Image
      expect(node3Label).toBeDefined();
      expect(node4Label).toBeDefined();
      expect(node3Label).toBe(node4Label);
    });

    it('should assign different labels to different levels', () => {
      // Create a deeper structure to test level differences
      const deepMockNodes: Node[] = [
        {
          id: 'root',
          name: 'Root',
          type: 'Div',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          children: [
            {
              id: 'level1-1',
              name: 'Level 1-1',
              type: 'Div',
              x: 0,
              y: 0,
              width: 50,
              height: 50,
              children: [
                {
                  id: 'leaf1',
                  name: 'Leaf 1',
                  type: 'Div',
                  x: 0,
                  y: 0,
                  width: 25,
                  height: 25,
                  children: [],
                },
              ],
            },
            {
              id: 'level1-2',
              name: 'Level 1-2',
              type: 'Div',
              x: 0,
              y: 0,
              width: 50,
              height: 50,
              children: [
                {
                  id: 'leaf2',
                  name: 'Leaf 2',
                  type: 'Div',
                  x: 0,
                  y: 0,
                  width: 25,
                  height: 25,
                  children: [],
                },
              ],
            },
            {
              id: 'level1-3',
              name: 'Level 1-3',
              type: 'Div',
              x: 0,
              y: 0,
              width: 50,
              height: 50,
              children: [
                {
                  id: 'level2-1',
                  name: 'Level 2-1',
                  type: 'Div',
                  x: 0,
                  y: 0,
                  width: 25,
                  height: 25,
                  children: [
                    {
                      id: 'level3-1',
                      name: 'Level 3-1',
                      type: 'Div',
                      x: 0,
                      y: 0,
                      width: 10,
                      height: 10,
                      children: [
                        {
                          id: 'deep-leaf',
                          name: 'Deep Leaf',
                          type: 'Div',
                          x: 0,
                          y: 0,
                          width: 5,
                          height: 5,
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      const labels = computeComponentLabels(deepMockNodes);

      // Root should not have a label
      expect(labels['root']).toBeUndefined();

      // Level 1 nodes should have same label (similar structure)
      const level1Label = labels['level1-1'];
      expect(level1Label).toBeDefined();
      expect(labels['level1-2']).toBe(level1Label);
      expect(labels['level1-3']).toBe(level1Label);

      // Level 2 should have different label
      const level2Label = labels['level2-1'];
      expect(level2Label).toBeDefined();
      expect(level2Label).not.toBe(level1Label);

      // Level 3 should have different label
      const level3Label = labels['level3-1'];
      expect(level3Label).toBeDefined();
      expect(level3Label).not.toBe(level1Label);
      expect(level3Label).not.toBe(level2Label);
    });
  });

  describe('nodeToStyle', () => {
    it('should convert node properties to CSS styles', () => {
      const node = mockNodes[0].children[2].children[0]; // Node 3 -> Button 1
      const styles = nodeToStyle(node);

      expect(styles.position).toBe('absolute');
      expect(styles.left).toBe(90);
      expect(styles.top).toBe(20);
      expect(styles.width).toBe(180);
      expect(styles.height).toBe(44);
      expect(styles.background).toBe('#0ea5e9');
      expect(styles.color).toBe('#fff');
    });

    it('should apply default styles for Button type', () => {
      const node = mockNodes[0].children[2].children[0]; // Node 3 -> Button 1
      const styles = nodeToStyle(node);

      expect(styles.borderRadius).toBe(8);
    });

    it('should apply default styles for Div type', () => {
      const node = mockNodes[0].children[2]; // Node 3
      const styles = nodeToStyle(node);

      expect(styles.borderRadius).toBe(8);
      expect(styles.padding).toBe(8);
    });
  });
});
