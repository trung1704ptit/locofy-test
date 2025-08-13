import { mockNodes } from '@/data/mockNodes';
import { fireEvent, render, screen } from '@testing-library/react';
import { TreeView } from '../index';

describe('TreeView', () => {
  const defaultProps = {
    nodes: mockNodes,
    selectedId: undefined,
    onSelect: jest.fn(),
    componentLabels: {
      'node-3': 'C1',
      'node-4': 'C1',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<TreeView {...defaultProps} />);
    expect(screen.getByText('Root')).toBeInTheDocument();
  });

  it('renders all root nodes', () => {
    render(<TreeView {...defaultProps} />);

    expect(screen.getByText('Root')).toBeInTheDocument();
    expect(screen.getByText('Text 1')).toBeInTheDocument();
    expect(screen.getByText('Button 1')).toBeInTheDocument();
    expect(screen.getByText('Image 1')).toBeInTheDocument();
  });

  it('shows expand/collapse buttons for nodes with children', () => {
    render(<TreeView {...defaultProps} />);

    const rootNode = screen.getByText('Root');
    const expandButton = rootNode.parentElement?.querySelector('button');
    expect(expandButton).toBeInTheDocument();
    expect(expandButton).toHaveTextContent('▼'); // Expanded by default
  });

  it('handles expand/collapse correctly', () => {
    render(<TreeView {...defaultProps} />);

    const rootNode = screen.getByText('Root');
    const expandButton = rootNode.parentElement?.querySelector('button');

    if (expandButton) {
      fireEvent.click(expandButton);
      expect(expandButton).toHaveTextContent('▶'); // Collapsed

      fireEvent.click(expandButton);
      expect(expandButton).toHaveTextContent('▼'); // Expanded again
    }
  });

  it('shows component labels for nodes that have them', () => {
    render(<TreeView {...defaultProps} />);

    // There are multiple C1 labels (Node 3 and Node 4), so use getAllByText
    const c1Labels = screen.getAllByText('C1');
    expect(c1Labels).toHaveLength(2);
    expect(c1Labels[0]).toBeInTheDocument();
    expect(c1Labels[1]).toBeInTheDocument();
  });

  it('does not show component labels for nodes without them', () => {
    render(<TreeView {...defaultProps} />);

    // Root should not have a label
    const rootNode = screen.getByText('Root');
    const labelElement =
      rootNode.parentElement?.querySelector('.text-cyan-800');
    expect(labelElement).not.toBeInTheDocument();
  });

  it('calls onSelect when node is clicked', () => {
    render(<TreeView {...defaultProps} />);

    const rootNode = screen.getByText('Root');
    fireEvent.click(rootNode);

    expect(defaultProps.onSelect).toHaveBeenCalledWith('root-1');
  });

  it('highlights selected node', () => {
    render(<TreeView {...defaultProps} selectedId="root-1" />);

    const rootNode = screen.getByText('Root');
    const parentElement = rootNode.parentElement;
    expect(parentElement).toHaveClass('bg-indigo-100');
  });

  it('shows correct type indicators', () => {
    render(<TreeView {...defaultProps} />);

    // Root has children, so should show expand button
    const rootNode = screen.getByText('Root');
    const expandButton = rootNode.parentElement?.querySelector('button');
    expect(expandButton).toBeInTheDocument();

    // Text 1 has no children, so should show placeholder
    const textNode = screen.getByText('Text 1');
    const placeholder =
      textNode.parentElement?.querySelector('.w-5.inline-block');
    expect(placeholder).toBeInTheDocument();
  });

  it('handles nested nodes correctly', () => {
    render(<TreeView {...defaultProps} />);

    // Root should be expanded by default
    expect(screen.getByText('Node 3')).toBeInTheDocument();
    expect(screen.getByText('Node 4')).toBeInTheDocument();
  });

  it('handles empty nodes array', () => {
    render(<TreeView {...defaultProps} nodes={[]} />);

    // Should render without crashing
    expect(screen.queryByText('Root')).not.toBeInTheDocument();
  });

  it('handles nodes without component labels', () => {
    const propsWithoutLabels = {
      ...defaultProps,
      componentLabels: {},
    };

    render(<TreeView {...propsWithoutLabels} />);

    // Should render without crashing
    expect(screen.getByText('Root')).toBeInTheDocument();
    expect(screen.queryByText('C1')).not.toBeInTheDocument();
  });

  it('maintains selection state between renders', () => {
    const { rerender } = render(
      <TreeView {...defaultProps} selectedId="root-1" />
    );

    expect(screen.getByText('Root').parentElement).toHaveClass('bg-indigo-100');

    // Re-render with same props
    rerender(<TreeView {...defaultProps} selectedId="root-1" />);

    // Selection should be maintained
    expect(screen.getByText('Root').parentElement).toHaveClass('bg-indigo-100');
  });

  it('prevents event propagation on expand/collapse', () => {
    render(<TreeView {...defaultProps} />);

    const rootNode = screen.getByText('Root');
    const expandButton = rootNode.parentElement?.querySelector('button');

    if (expandButton) {
      // Mock stopPropagation
      const mockStopPropagation = jest.fn();
      const mockEvent = { stopPropagation: mockStopPropagation };

      fireEvent.click(expandButton, mockEvent);

      // The click should not trigger onSelect
      expect(defaultProps.onSelect).not.toHaveBeenCalled();
    }
  });
});
