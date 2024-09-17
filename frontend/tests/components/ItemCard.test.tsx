// import '../setupTest'
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ItemCard from '../../src/components/ItemCard';
import { MenuItemDTO as MenuItem, MenuItemDTO } from '../../src/shared/types'

// Mock the `MenuController` component (if necessary)

describe('ItemCard', () => {
  // Test case 1: Valid MenuItem Data
  test('should render correctly with valid MenuItem data', () => {
    const menuItem: MenuItemDTO = {
      menuItemId: 'id',
      name: 'Big Mac',
      description: 'Delicious burger',
      price: 9.9,
      imageUrl: 'https://example.com/image.png',
    };

    render(<ItemCard menuItem={menuItem}/>)

    // Verify all sections are populated correctly
    expect(screen.getByText(menuItem.name)).toBeInTheDocument();
    expect(screen.getByText(menuItem.description)).toBeInTheDocument();
    expect(screen.getByText(`$${menuItem.price.toFixed(2)}`)).toBeInTheDocument();

    // test image
    const imageElement = screen.getByRole('img') as HTMLImageElement;
    expect(imageElement.src).toContain(menuItem.imageUrl);
  });

  // Test case 2: Missing Name in MenuItem
  test('should display an error message when name is missing', () => {
    const menuItem: Partial<MenuItem> = {
      description: 'Delicious burger',
      price: 9.9,
      imageUrl: 'https://example.com/image.png',
    };

    render(<ItemCard menuItem={menuItem} />);

    // Verify error message is displayed
    expect(screen.getByText('Default Name')).toBeInTheDocument();
  });

  // Test case 3: Invalid Price in MenuItem
  test('should display an error message when price is invalid', () => {
    const menuItem = {
      name: 'Big Mac',
      description: 'Delicious burger',
      imageUrl: 'https://example.com/image.png',
    };

    render(<ItemCard menuItem={menuItem} />);

  //   // Verify error message is displayed
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  // Test case 4: Missing ImageUrl in MenuItem
  test('should display a default image placeholder when imageUrl is missing', () => {
    const menuItem = {
      name: 'Big Mac',
      description: 'Delicious burger',
      price: 9.99,
    };

    render(<ItemCard menuItem={menuItem} />);

    // Verify default image placeholder is displayed
    const imageElement = screen.getByRole('img') as HTMLImageElement;
    expect(imageElement.src).toContain('/bigmac.png');
  });

  // Test case 5: Null MenuItem Object
  test('should display a global error message when menuItem is null', () => {
    render(<ItemCard menuItem={null} />);

    // Verify global error message is displayed
    expect(screen.getByText('Menu item data is missing')).toBeInTheDocument();
  });

  // Test case 9: Click Event
  test('should trigger the onItemCardContainerClick handler when clicked', () => {
    const onClickHandler = jest.fn();
    const menuItem = {
      name: 'Big Mac',
      description: 'Delicious burger',
      price: 9.99,
      imageUrl: 'https://example.com/image.png',
    };

    render(<ItemCard menuItem={menuItem} onItemCardContainerClick={onClickHandler} />);

    // Simulate a click on the item card container
    userEvent.click(screen.getByText('Big Mac'));

    // Verify the handler was called
    expect(onClickHandler).toHaveBeenCalled();
  });
});
