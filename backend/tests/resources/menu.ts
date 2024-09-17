import { ObjectId } from 'mongodb';
import { EMenuType } from '../../src/shared/types';

export const mockMenu = {
    _id: 'id',
    startTime: 480,
    endTime: 719,
    menuItems: ['66e0cb8332a8fb1c7597e252'],
    type: EMenuType.BREAKFAST
};

export const mockMenuItem = {
    _id: new ObjectId('66e0cb8332a8fb1c7597e252'),
    name: 'Big mac',
    description: 'Big mac',
    price: 5.5,
    imageUrl: 'bigmac.png'
};

export const mockGetMenuItemResult = {
    menuItemId: '66e0cb8332a8fb1c7597e252',
    name: 'Big mac',
    description: 'Big mac',
    price: 5.5,
    imageUrl: 'bigmac.png'
};

export const getAcitveMenuControllerResult = {
    type: mockMenu.type,
    menuItems: [mockGetMenuItemResult]
};
