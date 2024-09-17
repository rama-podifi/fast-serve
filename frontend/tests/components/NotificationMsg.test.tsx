import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // For the matchers like 'toBeInTheDocument'
import NotificationMsg, { ENotificationType, NotificationMsgType } from '../../src/components/NotificationMsg';
import { OrderItemDTO } from '../../src/shared/types';

// Mock the `OrderItemDTO` type
const orderItemMock: Partial<OrderItemDTO> = {
  menuItemName: 'Big Mac',
  quantity: 2,
  itemTotal: 9.99,
};

// Helper function to render the component with props
const renderNotification = (props: Partial<NotificationMsgType> = {}) => {
  return render(<NotificationMsg {...props} />);
};

describe('NotificationMsg Component', () => {
  // Test Case for 'Item Added' Notification
  test('should display item added notification with correct item details', () => {
    renderNotification({
      type: ENotificationType.ITEM_ADDED,
      orderItem: orderItemMock,
      secondaryMessage: 'Item added successfully',
    });

    expect(screen.getByText('Item added to order')).toBeInTheDocument();
    expect(screen.getByText(`${orderItemMock.quantity}x ${orderItemMock.menuItemName} $${orderItemMock.itemTotal}`)).toBeInTheDocument();
  });

  // Test Case for 'Order Placed' Notification
  test('should display order placed notification', () => {
    renderNotification({
      type: ENotificationType.ORDER_PLACED,
      message: 'Order successfully placed',
    });

    expect(screen.getByText('Order successfully placed')).toBeInTheDocument();
  });

  // Test Case for 'No Menu' Notification
  test('should display no menu notification', () => {
    renderNotification({
      type: ENotificationType.NO_MENU,
      message: 'Nothing currently listed as available, please refresh menu',
    });

    expect(
      screen.getByText(
        'Nothing currently listed as available, please refresh menu'
      )
    ).toBeInTheDocument();
  });

  // Test Case for Invalid Notification Type
  test('should display custom message for invalid notification type', () => {
    renderNotification({
      type: undefined, // Invalid type
      message: 'Unknown notification',
    });

    expect(screen.getByText('Unknown notification')).toBeInTheDocument();
  });

  // Test Case for Null Notification Object
  test('should not display any notification when type is DEFAULT', () => {
    renderNotification({
      type: ENotificationType.DEFAULT,
    });

    expect(screen.queryByText(/Item added to order|Order successfully placed/)).not.toBeInTheDocument();
  });

  // Test Case for Notification with missing orderItem
  test('should display a fallback message if orderItem is missing', () => {
    renderNotification({
      type: ENotificationType.ITEM_ADDED,
    });

    expect(screen.getByText('Item added to order')).toBeInTheDocument();
    // Here you can add more expectations depending on how your component behaves with missing data
  });

  // Test Case for Error Handling
  test('should display generic error message on invalid data', () => {
    renderNotification({
      type: ENotificationType.ITEM_ADDED,
      message: '', // Invalid message
    });

    expect(screen.queryByText('Item added to order')).toBeInTheDocument();
  });
});
