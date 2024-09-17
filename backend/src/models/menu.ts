import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { MenuItemSchema, MenuSchema, EMenuType } from '../shared/types';

const menuSchema = new mongoose.Schema<MenuSchema>({
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    type: { type: String, enum: EMenuType, required: true },
    menuItems: [String]
});

export const Menu = mongoose.model<MenuSchema>('Menu', menuSchema);
