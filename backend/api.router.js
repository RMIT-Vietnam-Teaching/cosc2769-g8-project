/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
import { Router } from 'express';

import accountController from './controllers/account.controller.js';
import customerProductController from './controllers/customerProduct.controller.js';
import hubController from './controllers/hub.controller.js';
import orderController from './controllers/order.controller.js';
import seedDataController from './controllers/seedData.controller.js';
import vendorController from './controllers/vendor.controller.js';
import middleware from './middleware.js';

const apiRouter = Router();

// Seed data routes
apiRouter.get('/seed-mongodb-data', seedDataController.start);

// Account
apiRouter.post('/login', middleware.isNotLoggedIn, accountController.login);
apiRouter.post('/logout', accountController.logout);
apiRouter.get('/account', accountController.fetch);
apiRouter.get('/account/profile', accountController.fetchProfile);
apiRouter.post('/account/profile-picture', middleware.upload.single('profilePicture'), accountController.updateProfilePicture);
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

// Customer product routes
apiRouter.get('/customers/products', customerProductController.list);
apiRouter.get('/customers/product/:id', customerProductController.getById);
apiRouter.get('/customers/products/name', customerProductController.getByName);
apiRouter.post('/customer/new-order', orderController.createCustomerOrder);

// Vendors
apiRouter.get('/vendor/products', middleware.isVendor, vendorController.allProducts);
apiRouter.get('/vendor/product/:id', middleware.isVendor, vendorController.productById);
apiRouter.post(
	'/vendor/new-product',
	middleware.isVendor,
	middleware.upload.fields([
		{ name: 'mainImage', maxCount: 1 },
		{ name: 'image' },
	]),
	vendorController.new,
);

export default apiRouter;
