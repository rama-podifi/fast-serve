import { NextFunction, Request, Response, Router } from 'express';
import { MenuController } from '../controllers/menu';

export class MenuRoute {
    private router: Router;

    private menuController: MenuController;

    public constructor(menuController: MenuController) {
        this.router = Router();
        this.menuController = menuController;
        this.router.get('/active', this.getActiveMenu.bind(this));
        this.router.get('/items/:id', this.getMenuItem.bind(this));
        this.router.post('/orders', this.addToOrder.bind(this));
        this.router.get('/orders', this.getOrder.bind(this));
        this.router.patch('/orders/:menuItemId', this.updateOrder.bind(this));
        this.router.delete('/orders/:menuItemId', this.removeOrderItem.bind(this));
        this.router.post('/orders/confirm', this.confirmOrder.bind(this));
    }

    getRouter(): Router {
        return this.router;
    }

    async getActiveMenu(_: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const activeMenu = await this.menuController.getActiveMenu();
            return res.status(200).json(activeMenu);
        } catch (err) {
            return next(err);
        }
    }

    async getMenuItem(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const menuItem = await this.menuController.getMenuItem(req.params.id);
            return res.status(200).json(menuItem);
        } catch (err) {
            return next(err);
        }
    }

    async addToOrder(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { menuItemId, quantity } = req.body;
            const newOrder = await this.menuController.addToOrder(menuItemId, quantity);
            return res.status(201).json(newOrder);
        } catch (err) {
            return next(err);
        }
    }

    async getOrder(_: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const order = await this.menuController.getOrder();
            return res.status(200).json(order);
        } catch (err) {
            return next(err);
        }
    }

    async updateOrder(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { menuItemId } = req.params;
            const { quantity } = req.body;
            const updatedOrders = await this.menuController.updateOrder(menuItemId, quantity);
            return res.status(200).json(updatedOrders);
        } catch (err) {
            return next(err);
        }
    }

    async removeOrderItem(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { menuItemId } = req.params;
            const updatedOrders = await this.menuController.removeOrderItem(menuItemId);
            return res.status(200).json(updatedOrders);
        } catch (err) {
            return next(err);
        }
    }

    async confirmOrder(_: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            await this.menuController.confirmOrder();
            return res.status(200).json({ message: 'Order has been confirmed' });
        } catch (err) {
            return next(err);
        }
    }
}
