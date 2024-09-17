import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import OrderItem from '../../src/components/OrderItem';
import { DebouncedFunc } from 'lodash';

// Mocking lodash debounce
jest.mock('lodash', () => ({
  debounce: jest.fn((fn) => fn),
}));

describe('OrderItem Component', () => {
  const mockRemoveOrder = jest.fn();
  const mockUpdateOrder = jest.fn() as unknown as DebouncedFunc<(menuItemId: string, quantity: number) => Promise<void>>;

  const defaultProps = {
    menuItemId: '123',
    itemName: 'Big Mac',
    itemPrice: '$9.99',
    itemSubTotal: '$19.98',
    itemQuantity: 2,
    orderItemImage: 'https://example.com/image.png',
    orderItemSeparator: 'https://example.com/separator.png',
    removeOrder: mockRemoveOrder,
    updateOrder: mockUpdateOrder,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render with valid props', () => {
    render(<OrderItem {...defaultProps} />);

    expect(screen.getByText('Big Mac')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByText('$19.98')).toBeInTheDocument();
    expect(screen.getByAltText('item-image')).toHaveAttribute('src', 'https://example.com/image.png');
  });

  test('should handle null OrderItemDTO gracefully', () => {
    render(
      <OrderItem
        menuItemId=""
        removeOrder={mockRemoveOrder}
        updateOrder={mockUpdateOrder}
      />
    );

    expect(screen.queryByText('Big Mac')).not.toBeInTheDocument();
    expect(screen.queryByText('$9.99')).not.toBeInTheDocument();
    expect(screen.queryByText('$19.98')).not.toBeInTheDocument();
    expect(screen.getByAltText('item-image')).toHaveAttribute('src', '/default-item.png');
  });

  test('should handle incomplete OrderItemDTO data', () => {
    render(
      <OrderItem
        menuItemId="123"
        itemName="Big Mac"
        itemPrice="$9.99"
        removeOrder={mockRemoveOrder}
        updateOrder={mockUpdateOrder}
      />
    );

    expect(screen.getByText('Big Mac')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.queryByText('$19.98')).not.toBeInTheDocument();
  });

  test('should call removeOrder when remove button is clicked', () => {
    render(<OrderItem {...defaultProps} />);

    fireEvent.click(screen.getByAltText('remove-button-123'));
    expect(mockRemoveOrder).toHaveBeenCalledWith('123');
  });

  test('should call updateOrder when quantity is changed', () => {
    render(<OrderItem {...defaultProps} />);

    fireEvent.click(screen.getByAltText('increment-button'));
    expect(mockUpdateOrder).toHaveBeenCalledWith('123', 3);

    fireEvent.click(screen.getByAltText('decrement-button'));
    expect(mockUpdateOrder).toHaveBeenCalledWith('123', 2);
  });

  test('should handle quantity input change', () => {
    render(<OrderItem {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText('1'), { target: { value: '5' } });
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    expect(mockUpdateOrder).toHaveBeenCalledWith('123', 5);
  });

  test('should render correctly according to Figma design', () => {
    // Assuming you have visual regression testing or manual inspection to verify UI matches the Figma design
    // This is a placeholder for manual or visual regression tests
    render(<OrderItem {...defaultProps} />);
    // Verify the component renders correctly based on Figma design
    // For manual inspection or visual snapshot testing
  });

  test('should handle performance with a large number of OrderItemDTO objects', () => {
    // Render multiple instances to check performance
    const largeNumberOfItems = Array.from({ length: 100 }, (_, index) => ({
      ...defaultProps,
      menuItemId: `item-${index}`,
      itemName: `Item ${index}`,
    }));

    render(
      <div>
        {largeNumberOfItems.map((props) => (
          <OrderItem key={props.menuItemId} {...props} />
        ))}
      </div>
    );

    // Performance checks can be done here
    // You might want to use performance profiling tools for more detailed analysis
  });
});
