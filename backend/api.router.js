import { Router } from 'express';

import accountController from './controllers/account.controller.js';
import hubController from './controllers/hub.controller.js';
import orderController from './controllers/order.controller.js';
import seedDataController from './controllers/seedData.controller.js';
import middleware from './middleware.js';

const apiRouter = Router();

// Seed data routes
apiRouter.get('/seed-mongodb-data', seedDataController.start);

// Account
apiRouter.post('/login', middleware.isNotLoggedIn, accountController.login);
apiRouter.post('/logout', accountController.logout);
apiRouter.get('/account', accountController.fetch);
apiRouter.post('/signup', middleware.upload.single('profilePicture'), accountController.signup);

// Hub
apiRouter.get('/hubs', hubController.listAll);

// Order routes for shipper dashboard
apiRouter.get('/orders', orderController.getOrders);
apiRouter.get('/orders/hub/:hubId', orderController.getOrdersByHub);
apiRouter.get('/orders/:orderId', orderController.getOrderById);
apiRouter.patch('/orders/:orderId/delivered', orderController.markAsDelivered);
apiRouter.patch('/orders/:orderId/cancel', orderController.cancelOrder);
apiRouter.get('/orders-stats', orderController.getOrderStats);

export default apiRouter;
