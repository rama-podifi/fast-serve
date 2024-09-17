import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ItemDetailsCard from '../../src/components/ItemDetailsCard';
import { MenuItemDTO } from '../../src/shared/types';
import { ENotificationType } from '../../src/components/NotificationMsg';

// const mockUseNavigate = jest.fn()
// Mocking useNavigate
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

// global.fetch = jest.fn(() =>
// Promise.resolve({
//     ok: true,
//     json: () => Promise.resolve({ menuItemId: '123', quantity: 1, menuItemPrice: 9.99 }),
// })
// ) as jest.Mock;



describe('ItemDetailsCard', () => {
    const mockSetNotification = jest.fn();
    // const mockNavigate = jest.fn();
  
    // beforeEach(() => {
    //   jest.clearAllMocks();
    //   (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    // });

  // Test Case 1: Valid MenuItem Data
  test('should display correct data when valid MenuItem is provided', () => {
    const menuItem: MenuItemDTO = {
      menuItemId: '1',
      name: 'Big Mac',
      description: 'Delicious burger',
      price: 9.99,
      imageUrl: 'https://example.com/image.png',
    };

    render(<ItemDetailsCard menuItem={menuItem} setNotification={mockSetNotification} />);

    expect(screen.getByAltText('Big Mac')).toHaveAttribute('src', 'https://example.com/image.png');
    expect(screen.getByText('Big Mac')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByText('Delicious burger')).toBeInTheDocument();
  });

  // Test Case 2: Missing ImageUrl in MenuItem
  test('should display default image if imageUrl is missing', () => {
    const menuItem: Partial<MenuItemDTO> = {
      menuItemId: '2',
      name: 'Big Mac',
      description: 'Delicious burger',
      price: 9.99,
    };

    render(<ItemDetailsCard menuItem={menuItem} setNotification={mockSetNotification} />);

    expect(screen.getByAltText('Big Mac')).toHaveAttribute('src', '/path/to/default-image.png');
  });

  // Test Case 3: Missing Data in MenuItem
  test('should display default values for missing data', () => {
    const menuItem: Partial<MenuItemDTO> = {
      menuItemId: '3',
    };

    render(<ItemDetailsCard menuItem={menuItem} setNotification={mockSetNotification} />);

    expect(screen.getByText('No Name Available')).toBeInTheDocument();
    expect(screen.getByText('$Price Not Available')).toBeInTheDocument();
    expect(screen.getByText('Description not available.')).toBeInTheDocument();
  });

  // Test Case 4: Handling Quantity Increment and Decrement
  test('should correctly handle quantity increment and decrement', () => {
    const menuItem: Partial<MenuItemDTO> = {
      menuItemId: '4',
      name: 'Big Mac',
      description: 'Delicious burger',
      price: 9.99,
      imageUrl: 'https://example.com/image.png',
    };

    render(<ItemDetailsCard menuItem={menuItem} setNotification={mockSetNotification} />);

    const incrementButton = screen.getByAltText('Increment Quantity');
    const decrementButton = screen.getByAltText('Decrement Quantity');
    const quantityInput = screen.getByPlaceholderText('1');

    // Click increment button
    fireEvent.click(incrementButton);
    expect(quantityInput).toHaveValue(2);

    // Click decrement button
    fireEvent.click(decrementButton);
    expect(quantityInput).toHaveValue(1);

    // Click decrement button when quantity is 1
    fireEvent.click(decrementButton);
    expect(quantityInput).toHaveValue(1); // Quantity should not go below 1
  });

  // Test Case 5: Handling Add to Order Button Click
  test('should handle Add to Order button click', async () => {
    const menuItem: Partial<MenuItemDTO> = {
      menuItemId: '5',
      name: 'Big Mac',
      description: 'Delicious burger',
      price: 9.99,
      imageUrl: 'https://example.com/image.png',
    };

    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      useNavigate: () => { return mockNavigate},
    }));

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          menuItemId: '5',
          quantity: 1,
          menuItemPrice: 9.99,
        }),
      }) as any
    );

    render(<ItemDetailsCard menuItem={menuItem} setNotification={mockSetNotification} />);

    const addToOrderButton = screen.getByText('Add To Order');
    fireEvent.click(addToOrderButton);

    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/menu/orders', {
            method: "POST",
            body: JSON.stringify({
                menuItemId: '5',
                quantity: 1, // updated quantity
            }),
            headers: {
            "Content-Type": "application/json",
            },
        });
   });

  });

//   Test Case 6: Handling Fetch Error
  test('should display notification on fetch error', async () => {
    const menuItem: Partial<MenuItemDTO> = {
      menuItemId: '6',
      name: 'Big Mac',
      description: 'Delicious burger',
      price: 9.99,
      imageUrl: 'https://example.com/image.png',
    };

    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Failed to fetch'))
    );

    render(<ItemDetailsCard menuItem={menuItem} setNotification={mockSetNotification} />);

    const addToOrderButton = screen.getByText('Add To Order');
    fireEvent.click(addToOrderButton);

    await waitFor(() => {
      expect(mockSetNotification).toHaveBeenCalledWith({
        notificationIconFrame: '/notificationiconframe@2x.png',
        notificationBackgroundColor: '#ffeeaa',
        message: 'Error: Failed to fetch',
      });
    });
  });
});
