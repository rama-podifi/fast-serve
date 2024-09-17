import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom/extend-expect';
import fetchMock from 'jest-fetch-mock';
import ViewOrder from '../../src/pages/ViewOrder';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe } from 'node:test';

// enable fetchMocks
fetchMock.enableMocks();

// Mock the NotificationMsg and OrderItem components
jest.mock('../../src/components/NotificationMsg', () => {
  return {
    __esModule: true,
    default: ({ message }: { message: string }) => <div data-testid="notification-msg">{message}</div>
  };
});


describe('ViewOrder Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  const mockOrderData = {
    orderItems: [
      {
        menuItemId: '1',
        menuItemName: 'Pasta',
        menuItemPrice: 15.99,
        menuItemImageUrl: '/pasta.png',
        quantity: 2,
        itemTotal: 31.98
      },
      {
        menuItemId: '2',
        menuItemName: 'Pizza',
        menuItemPrice: 10.99,
        menuItemImageUrl: '/pizza.png',
        quantity: 2,
        itemTotal: 21.98
      }
    ],
    totalOrderPrice: 53.96
  };

  const mockEmptyOrder = {
    orderItems: [],
    totalOrderPrice: 0
  };

  test('displays order items and total price correctly (Happy Path)', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockOrderData));

    render(
      <Router>
        <ViewOrder />
      </Router>
    );

    await waitFor(() => {
      // Check the details of each order item
      expect(screen.getByText('Pasta')).toBeInTheDocument();
      expect(screen.getByText('$15.99')).toBeInTheDocument();
      expect(screen.getByTestId('quantity-1')).toHaveDisplayValue('2');
      expect(screen.getByText('$31.98')).toBeInTheDocument();

      expect(screen.getByText('Pizza')).toBeInTheDocument();
      expect(screen.getByText('$10.99')).toBeInTheDocument();
      expect(screen.getByTestId('quantity-2')).toHaveDisplayValue('2');
      expect(screen.getByText('$21.98')).toBeInTheDocument();

      // Check the total order price
      expect(screen.getByText('$53.96')).toBeInTheDocument();
    });
  });

  test('displays notification when the order is empty (Unhappy Path)', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockEmptyOrder));

    render(
      <Router>
        <ViewOrder />
      </Router>
    );

    await waitFor(() => {
      // Check that the empty order notification is displayed
      expect(screen.getByTestId('notification-msg')).toHaveTextContent('You have nothing in this order');
    });
  });

  test('displays error notification when fetch fails', async () => {
    fetchMock.mockRejectOnce(new Error('Network Error'));

    render(
      <Router>
        <ViewOrder />
      </Router>
    );

    await waitFor(() => {
      // Check that the error notification is displayed
      expect(screen.getByTestId('notification-msg')).toHaveTextContent('Error: Network Error');
    });
  });

  test('removes order item and updates total price', async () => {
    fetchMock.mockResponses(
      [JSON.stringify(mockOrderData), { status: 200 }],
      [JSON.stringify(mockEmptyOrder), { status: 200 }]
    );

    render(
      <Router>
        <ViewOrder />
      </Router>
    );

    await waitFor(() => {
      // Initial order display
      expect(screen.getByText('Pasta')).toBeInTheDocument();
      expect(screen.getByText('$53.96')).toBeInTheDocument();
    });

    // Mock user action of removing an item (you'd simulate the event)
    // Here, we can trigger the removeOrder functionality
    // For simplicity, let's simulate a successful removal:
    userEvent.click(screen.getByAltText('remove-button-1'));

    await waitFor(() => {
      // Updated UI after item removal
      expect(screen.getByTestId('notification-msg')).toHaveTextContent('You have nothing in this order');
      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });
  });

  test('updates order quantity and price on order change', async () => {
    fetchMock.mockResponses(
        [JSON.stringify({
            orderItems: [mockOrderData.orderItems[0]],
            totalOrderPrice: 31.98
        }), { status: 200 }],
        [
            JSON.stringify({
                orderItems: [
                    {
                        menuItemId: '1',
                        menuItemName: 'Pasta',
                        menuItemPrice: 15.99,
                        menuItemImageUrl: '/pasta.png',
                        quantity: 3,
                        itemTotal: 47.97
                    }
                ],
                totalOrderPrice: 47.97
            }), 
            { status: 200 }
        ]
      );

    render(
      <Router>
        <ViewOrder />
      </Router>
    );

    await waitFor(() => {
      // Initially rendered order item details
      expect(screen.getByText('Pasta')).toBeInTheDocument();
      expect(screen.getAllByText('$31.98')[0]).toBeInTheDocument();
    });

    // Assuming that the updateOrder function is called on input change
    act(() => {
        userEvent.click(screen.getByAltText(`increment-button`));
    });

    await waitFor(() => {
      // Updated UI after order update
      expect(screen.getAllByText('$47.97')[0]).toBeInTheDocument();
    }, {
        timeout: 2500 // need this because update function is debounced
    });
  });

  test("should confirm the order and redirect to homepage with success notification", async () => {
    // Mock fetch response for confirming order
    fetchMock.mockResponseOnce(
      JSON.stringify({
        orderItems: [
          {
            menuItemId: "item1",
            menuItemName: "Burger",
            menuItemPrice: 9.99,
            quantity: 1,
            itemTotal: 9.99,
          },
        ],
        totalOrderPrice: 9.99,
      })
    );

    render(
      <Router>
        <ViewOrder />
      </Router>
    );

    // Wait for fetch to resolve and items to load
    await waitFor(() =>
      expect(screen.getByText("Burger")).toBeInTheDocument()
    );

    // Mock the POST request to confirm the order
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    // Click the "Place Order" button
    userEvent.click(screen.getByText("Place Order"));

    // Wait for the fetch and redirection to happen
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:3000/api/menu/orders/confirm",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
    });

    // Ensure notification and redirection (you may need to assert based on `navigate` mock)
    // Example: Check if notification for success appears
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(screen.queryByText(/Order Placed/i)).toBeNull(); // As redirection occurs, no notification should remain visible
  });

  test("should handle error when confirming the order fails", async () => {
    // Mock fetch response for confirming order failure
    fetchMock.mockResponseOnce(
      JSON.stringify({
        message: "Internal Server Error",
      }),
      { status: 500 }
    );

    render(
      <Router>
        <ViewOrder />
      </Router>
    );

    // Click the "Place Order" button
    userEvent.click(screen.getByText("Place Order"));

    // Wait for the fetch to resolve
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:3000/api/menu/orders/confirm",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      // Check that the error notification is shown
      expect(screen.getByText(/Error/)).toBeInTheDocument();
    });

    
  });

  test("should show notification when the order is empty", async () => {
    // Mock fetch response for an empty order
    fetchMock.mockResponseOnce(
      JSON.stringify({
        orderItems: [],
        totalOrderPrice: 0,
      })
    );

    render(
      <Router>
        <ViewOrder />
      </Router>
    );

    // Wait for fetch to resolve and notification to appear
    await waitFor(() =>
      expect(screen.getByText(/You have nothing in this order/i)).toBeInTheDocument()
    );

    // Check that there are no order items displayed
    expect(screen.queryByText("Burger")).toBeNull();
  });
});
