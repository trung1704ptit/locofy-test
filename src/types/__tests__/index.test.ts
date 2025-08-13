import type { Node, NodeType } from '@/types';

describe('Type definitions', () => {
  describe('NodeType', () => {
    it('should have correct union types', () => {
      const validTypes: NodeType[] = ['Div', 'Input', 'Image', 'Button'];

      validTypes.forEach(type => {
        expect(typeof type).toBe('string');
        expect(['Div', 'Input', 'Image', 'Button']).toContain(type);
      });
    });

    it('should not allow invalid types', () => {
      // This test ensures TypeScript compilation
      const validType: NodeType = 'Div';
      expect(validType).toBe('Div');
    });
  });

  describe('Node interface', () => {
    it('should have required properties', () => {
      const mockNode: Node = {
        id: 'test-id',
        x: 0,
        y: 0,
        name: 'Test Node',
        type: 'Div',
        width: 100,
        height: 100,
        children: [],
      };

      expect(mockNode.id).toBe('test-id');
      expect(mockNode.x).toBe(0);
      expect(mockNode.y).toBe(0);
      expect(mockNode.name).toBe('Test Node');
      expect(mockNode.type).toBe('Div');
      expect(mockNode.width).toBe(100);
      expect(mockNode.height).toBe(100);
      expect(mockNode.children).toEqual([]);
    });

    it('should allow optional properties', () => {
      const nodeWithOptionals: Node = {
        id: 'test-id',
        x: 0,
        y: 0,
        name: 'Test Node',
        type: 'Div',
        width: 100,
        height: 100,
        children: [],
        display: 'flex',
        background: '#ffffff',
        color: '#000000',
        border: '1px solid black',
        margin: '10px',
        padding: '20px',
        borderRadius: '8px',
        fontSize: '16px',
        fontFamily: 'Arial',
        fontWeight: 'bold',
        textAlign: 'center',
        text: 'Sample text',
        position: 'relative',
        zIndex: 1,
      };

      expect(nodeWithOptionals.display).toBe('flex');
      expect(nodeWithOptionals.background).toBe('#ffffff');
      expect(nodeWithOptionals.borderRadius).toBe('8px');
    });

    it('should allow nested children', () => {
      const parentNode: Node = {
        id: 'parent',
        x: 0,
        y: 0,
        name: 'Parent',
        type: 'Div',
        width: 200,
        height: 200,
        children: [
          {
            id: 'child',
            x: 10,
            y: 10,
            name: 'Child',
            type: 'Button',
            width: 50,
            height: 50,
            children: [],
          },
        ],
      };

      expect(parentNode.children).toHaveLength(1);
      expect(parentNode.children[0].id).toBe('child');
      expect(parentNode.children[0].type).toBe('Button');
    });
  });

  describe('Type compatibility', () => {
    it('should allow assignment of valid Node objects', () => {
      const divNode: Node = {
        id: 'div-1',
        x: 0,
        y: 0,
        name: 'Div Node',
        type: 'Div',
        width: 100,
        height: 100,
        children: [],
      };

      const buttonNode: Node = {
        id: 'btn-1',
        x: 0,
        y: 0,
        name: 'Button Node',
        type: 'Button',
        width: 100,
        height: 50,
        children: [],
        text: 'Click me',
      };

      const imageNode: Node = {
        id: 'img-1',
        x: 0,
        y: 0,
        name: 'Image Node',
        type: 'Image',
        width: 200,
        height: 150,
        children: [],
      };

      const inputNode: Node = {
        id: 'input-1',
        x: 0,
        y: 0,
        name: 'Input Node',
        type: 'Input',
        width: 200,
        height: 40,
        children: [],
      };

      // All should be valid Node types
      expect(divNode.type).toBe('Div');
      expect(buttonNode.type).toBe('Button');
      expect(imageNode.type).toBe('Image');
      expect(inputNode.type).toBe('Input');
    });
  });
});
