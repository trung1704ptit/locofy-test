import { mockNodes } from '@/data/mockNodes';
import { fireEvent, render, screen } from '@testing-library/react';
import CanvasPreview from '../index';

// Mock the constants
jest.mock('@/constants', () => ({
  APP_CONFIG: {
    canvasPreview: {
      defaultZoom: 1,
      minZoom: 0.1,
      maxZoom: 3,
      zoomStep: 0.1,
    },
  },
}));

describe('CanvasPreview', () => {
  const defaultProps = {
    nodes: mockNodes,
    selectedId: undefined,
    onSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<CanvasPreview {...defaultProps} />);
    expect(screen.getByText('+')).toBeInTheDocument();
    expect(screen.getByText('−')).toBeInTheDocument();
  });

  it('displays zoom controls', () => {
    render(<CanvasPreview {...defaultProps} />);

    expect(screen.getByTitle('Zoom In')).toBeInTheDocument();
    expect(screen.getByTitle('Zoom Out')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('handles zoom in correctly', () => {
    render(<CanvasPreview {...defaultProps} />);

    const zoomInButton = screen.getByTitle('Zoom In');
    fireEvent.click(zoomInButton);

    expect(screen.getByText('110%')).toBeInTheDocument();
  });

  it('handles zoom out correctly', () => {
    render(<CanvasPreview {...defaultProps} />);

    const zoomOutButton = screen.getByTitle('Zoom Out');
    fireEvent.click(zoomOutButton);

    expect(screen.getByText('90%')).toBeInTheDocument();
  });

  it('respects zoom limits', () => {
    render(<CanvasPreview {...defaultProps} />);

    const zoomOutButton = screen.getByTitle('Zoom Out');

    // Click zoom out multiple times to reach minimum
    for (let i = 0; i < 15; i++) {
      fireEvent.click(zoomOutButton);
    }

    expect(screen.getByText('10%')).toBeInTheDocument();
  });

  it('renders all nodes', () => {
    render(<CanvasPreview {...defaultProps} />);

    // Check if main nodes are rendered (note: Root name is not displayed in CanvasPreview)
    expect(screen.getByText('Text 1')).toBeInTheDocument();
    expect(screen.getByText('Text 2')).toBeInTheDocument();
    expect(screen.getByText('Button 1')).toBeInTheDocument();
    expect(screen.getByText('Button 2')).toBeInTheDocument();
  });

  it('calls onSelect when node is clicked', () => {
    render(<CanvasPreview {...defaultProps} />);

    const buttonNode = screen.getByText('Button 1');
    fireEvent.click(buttonNode);

    expect(defaultProps.onSelect).toHaveBeenCalledWith('btn-1');
  });

  it('highlights selected node', () => {
    render(<CanvasPreview {...defaultProps} selectedId="btn-1" />);

    const buttonNode = screen.getByText('Button 1');
    expect(buttonNode).toHaveClass('outline');
  });

  it('renders different node types correctly', () => {
    render(<CanvasPreview {...defaultProps} />);

    // Check if different node types are rendered
    expect(screen.getByText('Text 1')).toBeInTheDocument(); // Div with text
    expect(screen.getByAltText('Image 1')).toBeInTheDocument(); // Image
    expect(screen.getByText('Button 1')).toBeInTheDocument(); // Button text content
  });

  it('handles empty nodes array', () => {
    render(<CanvasPreview {...defaultProps} nodes={[]} />);

    expect(screen.getByText('+')).toBeInTheDocument();
    expect(screen.getByText('−')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('maintains zoom state between renders', () => {
    const { rerender } = render(<CanvasPreview {...defaultProps} />);

    const zoomInButton = screen.getByTitle('Zoom In');
    fireEvent.click(zoomInButton);

    expect(screen.getByText('110%')).toBeInTheDocument();

    // Re-render with same props
    rerender(<CanvasPreview {...defaultProps} />);

    // Zoom should be maintained
    expect(screen.getByText('110%')).toBeInTheDocument();
  });
});
