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