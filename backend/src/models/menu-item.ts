import mongoose from 'mongoose';
import { MenuItemSchema } from '../shared/types';

const menuItemSchema = new mongoose.Schema<MenuItemSchema>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true }
});

export const MenuItem = mongoose.model<MenuItemSchema>('MenuItem', menuItemSchema);
