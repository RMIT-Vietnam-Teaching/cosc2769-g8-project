import { Router } from 'express';
import seedDataController from './controllers/seedData.controller.js';
import orderController from './controllers/order.controller.js';

const apiRouter = Router();

// Seed data routes
apiRouter.get('/seed-mongodb-data', seedDataController.start);

// Order routes for shipper dashboard
apiRouter.get('/orders', orderController.getOrders);
apiRouter.get('/orders/hub/:hubId', orderController.getOrdersByHub);
apiRouter.get('/orders/:orderId', orderController.getOrderById);
apiRouter.patch('/orders/:orderId/delivered', orderController.markAsDelivered);
apiRouter.patch('/orders/:orderId/cancel', orderController.cancelOrder);
apiRouter.get('/orders-stats', orderController.getOrderStats);

export default apiRouter;
