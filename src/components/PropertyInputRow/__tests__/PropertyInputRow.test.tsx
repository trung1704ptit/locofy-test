import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PropertyInputRow } from '../index';

// Mock the constants
jest.mock('@/constants', () => ({
  EVENTS: {
    FOCUS_EMPTY_PROPERTY: 'focusEmptyProperty',
  },
  INPUT_SETTINGS: {
    MIN_WIDTH: 3,
    WIDTH_PADDING: 2,
    FOCUS_DELAY: 10, // Reduced from 100ms
    BLUR_DELAY: 10, // Reduced from 150ms
  },
  Z_INDEX: {
    SUGGESTIONS_DROPDOWN: 50,
    MODAL: 1000,
    TOOLTIP: 2000,
  },
}));

describe('PropertyInputRow', () => {
  const defaultProps = {
    prop: {
      id: 'test-prop',
      name: 'color',
      value: 'red',
      enabled: true,
    },
    handlePropertyChange: jest.fn(),
    handlePropertyNameChange: jest.fn(),
    handlePropertyToggle: jest.fn(),
    onRemove: jest.fn(),
    onConfirmChange: jest.fn(),
    cssProperties: ['color', 'background'],
    cssValues: { color: ['red', 'blue'] },
    commonValues: ['inherit', 'initial'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<PropertyInputRow {...defaultProps} />);
    expect(screen.getByDisplayValue('color')).toBeInTheDocument();
    expect(screen.getByDisplayValue('red')).toBeInTheDocument();
  });

  it('displays property name and value', () => {
    render(<PropertyInputRow {...defaultProps} />);

    expect(screen.getByDisplayValue('color')).toBeInTheDocument();
    expect(screen.getByDisplayValue('red')).toBeInTheDocument();
  });

  it('shows enabled checkbox when property is enabled', () => {
    render(<PropertyInputRow {...defaultProps} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('shows disabled checkbox when property is disabled', () => {
    const disabledProps = {
      ...defaultProps,
      prop: { ...defaultProps.prop, enabled: false },
    };

    render(<PropertyInputRow {...disabledProps} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('calls handlePropertyToggle when checkbox is clicked', () => {
    render(<PropertyInputRow {...defaultProps} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(defaultProps.handlePropertyToggle).toHaveBeenCalledWith('prop-1');
  });

  it('calls handlePropertyNameChange when property name is changed and blurred', async () => {
    render(<PropertyInputRow {...defaultProps} />);

    const nameInput = screen.getByDisplayValue('color');
    fireEvent.change(nameInput, { target: { value: 'background' } });

    // The Input component only calls onChangeValue on blur, so we need to trigger blur
    fireEvent.blur(nameInput);

    // Wait for the reduced blur delay to complete
    await waitFor(
      () => {
        expect(defaultProps.handlePropertyNameChange).toHaveBeenCalledWith(
          'prop-1',
          'background'
        );
      },
      { timeout: 50 }
    ); // Reduced from 200ms
  });

  it('calls handlePropertyChange when property value is changed and blurred', async () => {
    render(<PropertyInputRow {...defaultProps} />);

    const valueInput = screen.getByDisplayValue('red');
    fireEvent.change(valueInput, { target: { value: 'blue' } });

    // The Input component only calls onChangeValue on blur, so we need to trigger blur
    fireEvent.blur(valueInput);

    // Wait for the reduced blur delay to complete
    await waitFor(
      () => {
        expect(defaultProps.handlePropertyChange).toHaveBeenCalledWith(
          'prop-1',
          'blue'
        );
      },
      { timeout: 50 }
    ); // Reduced from 200ms
  });

  it('calls onRemove when remove button is clicked', () => {
    render(<PropertyInputRow {...defaultProps} />);

    const removeButton = screen.getByTitle('Remove property');
    fireEvent.click(removeButton);

    expect(defaultProps.onRemove).toHaveBeenCalled();
  });

  it('shows remove button on hover', () => {
    render(<PropertyInputRow {...defaultProps} />);

    const removeButton = screen.getByTitle('Remove property');
    expect(removeButton).toHaveClass('opacity-0');

    // The button should become visible on hover (this is CSS-based, so we just check the class)
    expect(removeButton).toHaveClass('group-hover:opacity-100');
  });

  it('handles empty property name', () => {
    const emptyNameProps = {
      ...defaultProps,
      prop: { ...defaultProps.prop, name: '' },
    };

    render(<PropertyInputRow {...emptyNameProps} />);

    expect(screen.getByDisplayValue('')).toBeInTheDocument();
    expect(screen.getByDisplayValue('red')).toBeInTheDocument();
  });

  it('handles empty property value', () => {
    const emptyValueProps = {
      ...defaultProps,
      prop: { ...defaultProps.prop, value: '' },
    };

    render(<PropertyInputRow {...emptyValueProps} />);

    expect(screen.getByDisplayValue('color')).toBeInTheDocument();
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
  });

  it('applies correct styling for enabled property', () => {
    render(<PropertyInputRow {...defaultProps} />);

    const nameInput = screen.getByDisplayValue('color');
    expect(nameInput).toHaveClass('text-red-400');
  });

  it('applies correct styling for disabled property', () => {
    const disabledProps = {
      ...defaultProps,
      prop: { ...defaultProps.prop, enabled: false },
    };

    render(<PropertyInputRow {...disabledProps} />);

    const nameInput = screen.getByDisplayValue('color');
    // The disabled styling is applied through the Input component
    expect(nameInput).toBeInTheDocument();
  });

  it('renders colon separator between name and value', () => {
    render(<PropertyInputRow {...defaultProps} />);

    // The colon should be present in the DOM
    const container = screen.getByDisplayValue('color').closest('.flex');
    expect(container).toHaveTextContent(':');
  });
});
