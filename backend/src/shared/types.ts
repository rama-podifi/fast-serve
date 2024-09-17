import { ObjectId } from 'mongodb';

// Menu
export type MenuSchema = {
    _id: ObjectId;
    startTime: number;
    endTime: number;
    menuItems: string[];
    type: EMenuType;
};

export enum EMenuType {
    BREAKFAST = 'breakfast',
    LUNCH = 'lunch',
    DINNER = 'dinner'
}

export type MenuItemSchema = {
    _id: ObjectId;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
};

export type MenuDTO = {
    type: string;
    menuItems: MenuItemDTO[];
};

export type MenuItemDTO = {
    menuItemId: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
};

// Order
export type OrderSchema = {
    orderItems: OrderItemSchema[];
    // getOrderTotal(): number;
};

export type OrderItemSchema = {
    _id: ObjectId;
    menuItemId: string;
    quantity: number;
};

export type OrderDTO = {
    totalOrderPrice: number;
    orderItems: OrderItemDTO[];
};

export type OrderItemDTO = {
    menuItemId: string;
    menuItemName: string;
    menuItemDescription: string;
    menuItemPrice: number;
    menuItemImageUrl: string;
    quantity: number;
    itemTotal: number;
};
