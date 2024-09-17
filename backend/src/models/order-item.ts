import mongoose from 'mongoose';
import { OrderItemSchema } from '../shared/types';

const orderItemSchema = new mongoose.Schema<OrderItemSchema>({
    menuItemId: { type: String, required: true },
    quantity: { type: Number, required: true }
});

export const OrderItem = mongoose.model<OrderItemSchema>('OrderItem', orderItemSchema);
