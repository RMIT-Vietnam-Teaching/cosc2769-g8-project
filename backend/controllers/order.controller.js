/**
 * Order Controller - Handles all order-related operations for shipper dashboard
 */

import { Order } from '#root/models.js';

const orderController = {};

/**
 * Get all orders for shipper dashboard
 *
 * @type {app.AsyncRequestHandler}
 */
orderController.getOrders = async (_req, res) => {
	try {
		const orders = await Order.find()
			.populate('customer', 'name address username')
			.populate('hub', 'name address')
			.populate('items.product', 'name price description')
			.sort({ createdAt: -1 });

		res.jsonData(orders);
	} catch (error) {
		console.error('Error fetching orders:', error);
		res.jsonErrorMsg(['Failed to fetch orders']);
	}
};

/**
 * Get orders by hub (for specific shipper)
 *
 * @type {app.AsyncRequestHandler}
 */
orderController.getOrdersByHub = async (req, res) => {
	try {
		const { hubId } = req.params;

		const orders = await Order.find({ hub: hubId })
			.populate('customer', 'name address username')
			.populate('hub', 'name address')
			.populate('items.product', 'name price description')
			.sort({ createdAt: -1 });

		res.jsonData(orders);
	} catch (error) {
		console.error('Error fetching orders by hub:', error);
		res.jsonErrorMsg(['Failed to fetch orders for hub']);
	}
};

/**
 * Get single order details
 *
 * @type {app.AsyncRequestHandler}
 */
orderController.getOrderById = async (req, res) => {
	try {
		const { orderId } = req.params;

		const order = await Order.findById(orderId)
			.populate('customer', 'name address username')
			.populate('hub', 'name address')
			.populate('items.product', 'name price description');

		if (!order) {
			return res.jsonErrorMsg(['Order not found']);
		}

		res.jsonData(order);
	} catch (error) {
		console.error('Error fetching order details:', error);
		res.jsonErrorMsg(['Failed to fetch order details']);
	}
};

/**
 * Update order status to delivered
 *
 * @type {app.AsyncRequestHandler}
 */
orderController.markAsDelivered = async (req, res) => {
	try {
		const { orderId } = req.params;

		const order = await Order.findByIdAndUpdate(
			orderId,
			{ status: 'delivered' },
			{ new: true },
		);

		if (!order) {
			return res.jsonErrorMsg(['Order not found']);
		}

		res.jsonData(order);
	} catch (error) {
		console.error('Error marking order as delivered:', error);
		res.jsonErrorMsg(['Failed to update order status']);
	}
};

/**
 * Update order status to canceled
 *
 * @type {app.AsyncRequestHandler}
 */
orderController.cancelOrder = async (req, res) => {
	try {
		const { orderId } = req.params;

		const order = await Order.findByIdAndUpdate(
			orderId,
			{ status: 'canceled' },
			{ new: true },
		);

		if (!order) {
			return res.jsonErrorMsg(['Order not found']);
		}

		res.jsonData(order);
	} catch (error) {
		console.error('Error canceling order:', error);
		res.jsonErrorMsg(['Failed to cancel order']);
	}
};

/**
 * Get order statistics
 *
 * @type {app.AsyncRequestHandler}
 */
orderController.getOrderStats = async (_req, res) => {
	try {
		const [stats, totalOrders] = await Promise.all([
			Order.aggregate([
				{
					$group: {
						_id: '$status',
						count: { $sum: 1 },
						totalValue: { $sum: '$totalPrice' },
					},
				},
			]),
			Order.countDocuments(),
		]);

		res.jsonData({ totalOrders, statusBreakdown: stats });
	} catch (error) {
		console.error('Error fetching order stats:', error);
		res.jsonErrorMsg(['Failed to fetch order statistics']);
	}
};

export default orderController;
