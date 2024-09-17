import { MenuController } from '../../../src/controllers/menu';
import { Menu } from '../../../src/models/menu';
import { MenuItem } from '../../../src/models/menu-item';
import { OrderItem } from '../../../src/models/order-item';
import { EErrorCodes, StandardError } from '../../../src/shared/error';
import { getAcitveMenuControllerResult, mockGetMenuItemResult, mockMenu, mockMenuItem } from '../../resources/menu';
import {
    mockGetOrderItemsResult,
    mockGetOrderResult,
    mockOrderItemDTO,
    orderItem,
    orderItems
} from '../../resources/order';

jest.mock('../../../src/models/menu.ts');
jest.mock('../../../src/models/menu-item.ts');
jest.mock('../../../src/models/order-item.ts');

describe('MenuController', () => {
    let menuController: MenuController;
    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        menuController = new MenuController();
    });

    describe('getActiveMenu', () => {
        it('should return as expected', async () => {
            Menu.findOne = jest.fn().mockResolvedValueOnce(mockMenu);
            menuController.getMenuItem = jest.fn().mockResolvedValueOnce(mockGetMenuItemResult);

            const result = await menuController.getActiveMenu();
            expect(result).toEqual(getAcitveMenuControllerResult);
        });

        it('should omit menu when get menu item is null', async () => {
            Menu.findOne = jest.fn().mockResolvedValueOnce(mockMenu);
            menuController.getMenuItem = jest.fn().mockResolvedValueOnce(null);

            const result = await menuController.getActiveMenu();
            expect(result).toEqual({
                ...getAcitveMenuControllerResult,
                menuItems: []
            });
        });

        it('should throw not found error when menu is not found', async () => {
            Menu.findOne = jest.fn().mockResolvedValueOnce(null);
            return expect(menuController.getActiveMenu()).rejects.toThrow(
                new StandardError(404, EErrorCodes.NOT_FOUND, 'Menu is not available for current time')
            );
        });

        it('should handle database connection failure gracefully', async () => {
            const error = new Error('Database connection failed');
            Menu.findOne = jest.fn().mockRejectedValueOnce(error);

            return expect(menuController.getActiveMenu()).rejects.toThrow(error);
        });

        it('should return an empty MenuDTO when menu items are empty', async () => {
            Menu.findOne = jest.fn().mockResolvedValueOnce({
                ...mockMenu,
                menuItems: []
            });

            // Act
            const result = await menuController.getActiveMenu();

            // Assert
            expect(result).toEqual({
                ...getAcitveMenuControllerResult,
                menuItems: []
            });
        });
    });

    describe('getMenuItem', () => {
        const validId = '66e0cb8332a8fb1c7597e252';

        it('should return as expected', async () => {
            MenuItem.findById = jest.fn().mockResolvedValueOnce(mockMenuItem);

            const result = await menuController.getMenuItem(validId);
            expect(result).toEqual(mockGetMenuItemResult);
        });

        it('should throw not found error when menu item id is invalid', async () => {
            return expect(menuController.getMenuItem('aa')).rejects.toThrow(
                new StandardError(400, EErrorCodes.BAD_REQUEST, 'id is invalid')
            );
        });

        it('should handle database connection failure gracefully', async () => {
            const error = new Error('Database connection failed');
            MenuItem.findById = jest.fn().mockRejectedValueOnce(error);

            return expect(menuController.getMenuItem(validId)).rejects.toThrow(error);
        });

        it('should throw not found error when menu is not found', async () => {
            MenuItem.findById = jest.fn().mockResolvedValueOnce(null);
            return expect(menuController.getMenuItem(validId)).rejects.toThrow(
                new StandardError(404, EErrorCodes.NOT_FOUND, 'menu item not found')
            );
        });
    });

    describe('getOrderItem', () => {
        const validId = '66e0cb8332a8fb1c7597e252';

        it('should return an OrderItem when a valid menuItemId corresponds to an existing order item', async () => {
            // Arrange
            OrderItem.findOne = jest.fn().mockResolvedValue(orderItem);

            // Act
            const result = await menuController.getOrderItem(validId);

            // Assert
            expect(result).toEqual(orderItem);
        });

        it('should return null when menuItemId is valid but no corresponding order item is found', async () => {
            // Arrange
            OrderItem.findOne = jest.fn().mockResolvedValue(null);

            // Act
            const result = await menuController.getOrderItem(validId);

            // Assert
            expect(result).toBeNull();
        });

        it('should return an error when an invalid or null menuItemId is provided', async () => {
            // Act & Assert
            return expect(menuController.getOrderItem('aa')).rejects.toThrow(
                new StandardError(400, EErrorCodes.BAD_REQUEST, 'id is invalid')
            );
        });

        it('should handle database connection error gracefully', async () => {
            // Arrange
            const error = new Error('Database connection failed');
            OrderItem.findOne = jest.fn().mockRejectedValueOnce(error);

            return expect(menuController.getOrderItem(validId)).rejects.toThrow(error);
        });
    });

    describe('updateOrderItem', () => {
        const validId = '66e0cb8332a8fb1c7597e252';

        it('should return an OrderItem when a valid menuItemId and quantity', async () => {
            // Arrange
            OrderItem.findOneAndUpdate = jest.fn().mockResolvedValue(orderItem);

            // Act
            const result = await menuController.updateOrderItem(validId, 2);

            // Assert
            expect(result).toEqual(orderItem);
        });

        it('should return null when menuItemId is valid but no corresponding order item is found', async () => {
            // Arrange
            OrderItem.findOneAndUpdate = jest.fn().mockResolvedValue(null);

            // Act
            const result = await menuController.updateOrderItem(validId, 2);

            // Assert
            expect(result).toBeNull();
        });

        it('should return an error when an invalid or null menuItemId is provided', async () => {
            // Act & Assert
            return expect(menuController.updateOrderItem('aa', 2)).rejects.toThrow(
                new StandardError(400, EErrorCodes.BAD_REQUEST, 'id is invalid')
            );
        });

        it('should handle database connection error gracefully', async () => {
            // Arrange
            const error = new Error('Database connection failed');
            OrderItem.findOneAndUpdate = jest.fn().mockRejectedValueOnce(error);

            return expect(menuController.updateOrderItem(validId, 2)).rejects.toThrow(error);
        });
    });

    describe('addOrderItem', () => {
        const validId = '66e0cb8332a8fb1c7597e252';

        it('should return an OrderItem when a valid menuItemId and quantity', async () => {
            // Arrange
            OrderItem.create = jest.fn().mockResolvedValue(orderItem);

            // Act
            const result = await menuController.addOrderItem(validId, 2);

            // Assert
            expect(result).toEqual(orderItem);
        });

        it('should return null when menuItemId is valid but no corresponding order item is found', async () => {
            // Arrange
            OrderItem.create = jest.fn().mockResolvedValue(null);

            // Act
            const result = await menuController.addOrderItem(validId, 2);

            // Assert
            expect(result).toBeNull();
        });

        describe('Invalid menuItemId or quantity', () => {
            it('should return an error when an invalid or null menuItemId is provided', async () => {
                // Act & Assert
                return expect(menuController.addOrderItem('aa', 2)).rejects.toThrow(
                    new StandardError(400, EErrorCodes.BAD_REQUEST, 'id is invalid')
                );
            });

            it('should return an error when an invalid or null quanityty is provided', async () => {
                // Act & Assert
                return expect(menuController.addOrderItem(validId, -1)).rejects.toThrow(
                    new StandardError(400, EErrorCodes.BAD_REQUEST, 'quantity is invalid')
                );
            });
        });

        it('should handle database connection error gracefully', async () => {
            // Arrange
            const error = new Error('Database connection failed');
            OrderItem.create = jest.fn().mockRejectedValueOnce(error);

            return expect(menuController.addOrderItem(validId, 2)).rejects.toThrow(error);
        });
    });

    describe('addToOrder', () => {
        const validId = '66e0cb8332a8fb1c7597e252';

        it('should add new OrderItem when a valid menuItemId and quantity and OrderItem is not exist', async () => {
            // Arrange
            menuController.getMenuItem = jest.fn().mockResolvedValueOnce(mockGetMenuItemResult);
            menuController.getOrderItem = jest.fn().mockResolvedValueOnce(null);
            const spy = jest.spyOn(menuController, 'addOrderItem').mockResolvedValueOnce(orderItem);

            // Act
            const result = await menuController.addToOrder(validId, 2);

            // Assert
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(validId, 2);
            expect(result).toEqual(mockOrderItemDTO);
        });

        it('should update OrderItem when a valid menuItemId and quantity and OrderItem is exist', async () => {
            // Arrange
            menuController.getMenuItem = jest.fn().mockResolvedValueOnce(mockGetMenuItemResult);
            menuController.getOrderItem = jest.fn().mockResolvedValueOnce(orderItem);
            const spy = jest.spyOn(menuController, 'updateOrderItem').mockResolvedValueOnce(orderItem);

            // Act
            const result = await menuController.addToOrder(validId, 2);

            // Assert
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(validId, 2);
            expect(result).toEqual(mockOrderItemDTO);
        });

        describe('Invalid menuItemId or quantity', () => {
            it('should return an error when an invalid or null menuItemId is provided', async () => {
                // Act & Assert
                return expect(menuController.addToOrder('aa', 2)).rejects.toThrow(
                    new StandardError(400, EErrorCodes.BAD_REQUEST, 'id is invalid')
                );
            });

            it('should return an error when an invalid or null quanityty is provided', async () => {
                // Act & Assert
                return expect(menuController.addToOrder(validId, -1)).rejects.toThrow(
                    new StandardError(400, EErrorCodes.BAD_REQUEST, 'quantity is invalid')
                );
            });
        });

        describe('database error', () => {
            it('should handle database connection error gracefully', async () => {
                // Arrange
                const error = new Error('Database connection failed');
                menuController.getMenuItem = jest.fn().mockResolvedValueOnce(mockGetMenuItemResult);
                menuController.getOrderItem = jest.fn().mockResolvedValueOnce(orderItem);
                OrderItem.findOneAndUpdate = jest.fn().mockRejectedValueOnce(error);

                return expect(menuController.addToOrder(validId, 2)).rejects.toThrow(error);
            });

            it('should handle database operation not working', async () => {
                // Arrange
                const error = new StandardError(500, 'INERNAL_SERROR', 'Something is wrong when add order to db');
                menuController.getMenuItem = jest.fn().mockResolvedValueOnce(mockGetMenuItemResult);
                menuController.getOrderItem = jest.fn().mockResolvedValueOnce(orderItem);
                OrderItem.findOneAndUpdate = jest.fn().mockResolvedValueOnce(null);

                return expect(menuController.addToOrder(validId, 2)).rejects.toThrow(error);
            });
        });
    });

    describe('getOrderItems', () => {
        it('should return order items and corresponding menu item details', async () => {
            // Arrange
            OrderItem.find = jest.fn().mockResolvedValueOnce(orderItems);
            menuController.getMenuItem = jest.fn().mockResolvedValueOnce(mockGetMenuItemResult);

            // Act
            const result = await menuController.getOrderItems();

            // Assert
            expect(result).toEqual(mockGetOrderItemsResult);
        });

        it('should return empty list order items', async () => {
            // Arrange
            OrderItem.find = jest.fn().mockResolvedValueOnce([]);

            // Act
            const result = await menuController.getOrderItems();

            // Assert
            expect(result).toEqual([]);
        });

        it('should handle database connection error gracefully', async () => {
            // Arrange
            const error = new Error('Database connection failed');
            OrderItem.find = jest.fn().mockRejectedValueOnce(error);

            return expect(menuController.getOrderItems()).rejects.toThrow(error);
        });

        it('should handle when failed to retreive menu item detail', async () => {
            // Arrange
            const error = new StandardError(404, EErrorCodes.NOT_FOUND, 'menu item not found');
            OrderItem.find = jest.fn().mockResolvedValueOnce(orderItems);
            menuController.getMenuItem = jest.fn().mockRejectedValueOnce(error);

            return expect(menuController.getOrderItems()).rejects.toThrow(error);
        });
    });

    describe('getOrder', () => {
        it('should return the correct total order price and a detailed list of order items', async () => {
            // Arrange
            menuController.getOrderItems = jest.fn().mockResolvedValueOnce(mockGetOrderItemsResult);

            // Act
            const result = await menuController.getOrder();

            // Assert
            expect(result).toEqual(mockGetOrderResult);
        });

        it('should return when order items are empty', async () => {
            // Arrange
            menuController.getOrderItems = jest.fn().mockResolvedValueOnce([]);

            // Act
            const result = await menuController.getOrder();

            // Assert
            expect(result).toEqual({
                totalOrderPrice: 0,
                orderItems: []
            });
        });

        it('should handle database connection error gracefully', async () => {
            // Arrange
            const error = new Error('Database connection failed');
            menuController.getOrderItems = jest.fn().mockRejectedValueOnce(error);

            return expect(menuController.getOrder()).rejects.toThrow(error);
        });

        it('should handle when failed to retreive menu item detail', async () => {
            // Arrange
            const error = new StandardError(404, EErrorCodes.NOT_FOUND, 'menu item not found');
            menuController.getOrderItems = jest.fn().mockRejectedValueOnce(error);

            return expect(menuController.getOrder()).rejects.toThrow(error);
        });
    });

    describe('updateOrder', () => {
        const validId = '66e0cb8332a8fb1c7597e252';

        it('should return an OrderItem when a valid menuItemId and quantity', async () => {
            // Arrange
            menuController.updateOrderItem = jest.fn().mockResolvedValue(orderItem);
            menuController.getOrder = jest.fn().mockResolvedValue(mockGetOrderResult);

            // Act
            const result = await menuController.updateOrder(validId, 2);

            // Assert
            expect(result).toEqual(mockGetOrderResult);
        });

        describe('Invalid menuItemId or quantity', () => {
            it('should return an error when an invalid or null menuItemId is provided', async () => {
                // Act & Assert
                return expect(menuController.updateOrder('aa', 2)).rejects.toThrow(
                    new StandardError(400, EErrorCodes.BAD_REQUEST, 'id is invalid')
                );
            });

            it('should return an error when an invalid or null quanityty is provided', async () => {
                // Act & Assert
                return expect(menuController.updateOrder(validId, -1)).rejects.toThrow(
                    new StandardError(400, EErrorCodes.BAD_REQUEST, 'quantity is invalid')
                );
            });
        });

        it('should handle database connection error gracefully when update', async () => {
            // Arrange
            const error = new Error('Database connection failed');
            menuController.updateOrderItem = jest.fn().mockRejectedValueOnce(error);

            return expect(menuController.updateOrder(validId, 2)).rejects.toThrow(error);
        });

        it('should handle database connection error gracefully when get data', async () => {
            // Arrange
            const error = new Error('Database connection failed');
            menuController.getOrder = jest.fn().mockRejectedValueOnce(error);

            return expect(menuController.updateOrder(validId, 2)).rejects.toThrow(error);
        });
    });

    describe('removeOrderItem', () => {
        const validId = '66e0cb8332a8fb1c7597e252';

        it('should return an OrderItem when a valid menuItemId', async () => {
            // Arrange
            OrderItem.deleteOne = jest.fn().mockResolvedValue({});
            menuController.getOrder = jest.fn().mockResolvedValue({
                totalOrderPrice: 0,
                orderItem: 0
            });

            // Act
            const result = await menuController.removeOrderItem(validId);

            // Assert
            expect(result).toEqual({
                totalOrderPrice: 0,
                orderItem: 0
            });
        });

        it('should return an error when an invalid or null menuItemId is provided', async () => {
            // Act & Assert
            return expect(menuController.removeOrderItem('aa')).rejects.toThrow(
                new StandardError(400, EErrorCodes.BAD_REQUEST, 'id is invalid')
            );
        });

        it('should handle database connection error gracefully when delete', async () => {
            // Arrange
            const error = new Error('Database connection failed');
            OrderItem.deleteOne = jest.fn().mockRejectedValueOnce(error);

            return expect(menuController.removeOrderItem(validId)).rejects.toThrow(error);
        });

        it('should handle database connection error gracefully when get data', async () => {
            // Arrange
            const error = new Error('Database connection failed');
            menuController.getOrder = jest.fn().mockRejectedValueOnce(error);

            return expect(menuController.removeOrderItem(validId)).rejects.toThrow(error);
        });
    });

    describe('confirmOrder', () => {
        it('should delete all order', async () => {
            // arrange
            const spy = jest.spyOn(OrderItem, 'deleteMany').mockResolvedValueOnce({
                acknowledged: true,
                deletedCount: 1
            });

            //act
            await menuController.confirmOrder();

            //assert
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('should throw error when database deletion is error', async () => {
            // arrange
            const error = new Error('Database connection failed');
            OrderItem.deleteMany = jest.fn().mockRejectedValueOnce(error);

            //act & assert
            return expect(menuController.confirmOrder()).rejects.toThrow(error);
        });
    });
});
