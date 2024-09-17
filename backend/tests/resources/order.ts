import { ObjectId } from 'mongodb';
import { OrderDTO, OrderItemDTO, OrderItemSchema } from '../../src/shared/types';
import { mockMenuItem } from './menu';

export const orderItem: OrderItemSchema = {
    _id: new ObjectId('66e0cb8332a8fb1c7597e252'),
    menuItemId: '66e0cb8332a8fb1c7597e252',
    quantity: 2
};

export const orderItems: OrderItemSchema[] = [
    {
        _id: new ObjectId('66e0cb8332a8fb1c7597e252'),
        menuItemId: '66e0cb8332a8fb1c7597e252',
        quantity: 2
    }
];

export const mockOrderItemDTO: OrderItemDTO = {
    menuItemId: mockMenuItem._id.toString(),
    menuItemName: mockMenuItem.name,
    menuItemDescription: mockMenuItem.description,
    menuItemPrice: mockMenuItem.price,
    menuItemImageUrl: mockMenuItem.imageUrl,
    quantity: orderItem.quantity,
    itemTotal: orderItem.quantity * mockMenuItem.price
};

export const mockGetOrderItemsResult: OrderItemDTO[] = [mockOrderItemDTO];

export const mockGetOrderResult: OrderDTO = {
    totalOrderPrice: mockGetOrderItemsResult.reduce((previous, current) => previous + current.itemTotal, 0),
    orderItems: mockGetOrderItemsResult
};
