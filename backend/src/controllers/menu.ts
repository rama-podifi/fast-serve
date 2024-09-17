import mongoose from 'mongoose';
import { Menu } from '../models/menu';
import { EErrorCodes, StandardError } from '../shared/error';
import { MenuDTO, MenuItemDTO, OrderDTO, OrderItemDTO, OrderItemSchema } from '../shared/types';
import { OrderItem } from '../models/order-item';
import { MenuItem } from '../models/menu-item';

export class MenuController {
    async getActiveMenu(): Promise<MenuDTO> {
        const now = new Date();
        const timeInteger = now.getHours() * 60 + now.getMinutes();

        const menu = await Menu.findOne({
            startTime: {
                $lte: timeInteger
            },
            endTime: {
                $gte: timeInteger
            }
        });

        if (!menu) {
            throw new StandardError(404, EErrorCodes.NOT_FOUND, 'Menu is not available for current time');
        }

        let menuItems = [];
        for (let menuItem of menu.menuItems) {
            const menuItemDetail = await this.getMenuItem(menuItem);

            if (!menuItemDetail) continue;

            menuItems.push(menuItemDetail);
        }

        return { type: menu.type, menuItems };
    }

    async getMenuItem(menuItemId: string): Promise<MenuItemDTO> {
        this.isIdInvalid(menuItemId);

        const menuItem = await MenuItem.findById(menuItemId);

        if (!menuItem) {
            throw new StandardError(404, EErrorCodes.NOT_FOUND, 'menu item not found');
        }

        return {
            menuItemId: menuItem._id.toString(),
            name: menuItem.name,
            description: menuItem.description,
            price: menuItem.price,
            imageUrl: menuItem.imageUrl
        };
    }

    async getOrderItem(menuItemId: string): Promise<OrderItemSchema | null> {
        this.isIdInvalid(menuItemId);

        const orderItem = await OrderItem.findOne({
            menuItemId
        });

        if (!orderItem) {
            return null;
        }

        return orderItem;
    }

    async updateOrderItem(menuItemId: string, quantity: number): Promise<OrderItemSchema | null> {
        this.isIdInvalid(menuItemId);
        this.isQuantityValid(quantity);

        const updated = await OrderItem.findOneAndUpdate(
            {
                menuItemId
            },
            {
                quantity
            },
            { returnDocument: 'after' }
        );

        return updated;
    }

    async addOrderItem(menuItemId: string, quantity: number): Promise<OrderItemSchema> {
        this.isIdInvalid(menuItemId);
        this.isQuantityValid(quantity);

        const newOrder = await OrderItem.create({ menuItemId, quantity });
        return newOrder;
    }

    async addToOrder(menuItemId: string, quantity: number): Promise<OrderItemDTO> {
        this.isIdInvalid(menuItemId);
        this.isQuantityValid(quantity);

        const menuItem = await this.getMenuItem(menuItemId);

        let order;
        const isOrderExist = await this.getOrderItem(menuItemId);

        if (isOrderExist) {
            order = await this.updateOrderItem(menuItemId, quantity);
        } else {
            order = await this.addOrderItem(menuItemId, quantity);
        }

        if (!order) {
            throw new StandardError(500, 'INERNAL_SERROR', 'Something is wrong when add order to db');
        }

        return {
            menuItemId: menuItem.menuItemId,
            menuItemName: menuItem.name,
            menuItemDescription: menuItem.description,
            menuItemPrice: menuItem.price,
            menuItemImageUrl: menuItem.imageUrl,
            quantity: order.quantity,
            itemTotal: order.quantity * menuItem.price
        };
    }

    async getOrderItems(): Promise<OrderItemDTO[]> {
        const orderItems = await OrderItem.find();

        const structuredOrder = [];
        for (const orderItem of orderItems) {
            const menuItem = await this.getMenuItem(orderItem.menuItemId);
            structuredOrder.push({
                menuItemId: menuItem.menuItemId,
                menuItemName: menuItem.name,
                menuItemDescription: menuItem.description,
                menuItemPrice: menuItem.price,
                menuItemImageUrl: menuItem.imageUrl,
                quantity: orderItem.quantity,
                itemTotal: orderItem.quantity * menuItem.price
            });
        }

        return structuredOrder;
    }

    async getOrder(): Promise<OrderDTO> {
        const orderItems = await this.getOrderItems();
        const totalOrderPrice = orderItems.reduce((previous, current) => previous + current.itemTotal, 0);

        return {
            totalOrderPrice,
            orderItems
        };
    }

    async updateOrder(menuItemId: string, quantity: number): Promise<OrderDTO> {
        this.isIdInvalid(menuItemId);
        this.isQuantityValid(quantity);

        await this.updateOrderItem(menuItemId, quantity);

        return this.getOrder();
    }

    async removeOrderItem(menuItemId: string): Promise<OrderDTO> {
        this.isIdInvalid(menuItemId);

        await OrderItem.deleteOne({ menuItemId });

        return this.getOrder();
    }

    async confirmOrder(): Promise<void> {
        await OrderItem.deleteMany();
    }

    isIdInvalid(id: string): void {
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            throw new StandardError(400, EErrorCodes.BAD_REQUEST, 'id is invalid');
        }
    }

    isQuantityValid(value: any): void {
        if (typeof value !== 'number' || value < 0) {
            throw new StandardError(400, EErrorCodes.BAD_REQUEST, 'quantity is invalid');
        }
    }
}
