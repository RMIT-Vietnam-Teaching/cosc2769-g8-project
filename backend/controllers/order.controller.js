/**
 * Order Controller - Handles all order-related operations for shipper dashboard
 */

import { DistributionHub, Order } from '#root/models.js';
import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const OrderItemInputSchema = z.object({
	productId: z.string().regex(objectIdRegex, 'Invalid product id'),
	price: z.preprocess((v) => Number(v), z.number().nonnegative()),
});

const NewOrderBodySchema = z.object({
	items: z.array(OrderItemInputSchema).min(1, 'Cart is empty.'),
	hubId: z.string().optional(),
});

/**
 * Validate and parse new-order request body.
 * @param {import('express').Request} req
 * @returns {{ ok: true, data: { items: Array<{productId: string, price: number}>, hubId?: string } } | { ok: false, errors: string[] }}
 */
function parseCustomerNewOrderBody(req) {
	const itemsInput = Array.isArray(req.body?.items) ? req.body.items : [];
	const hubId = req.body?.hubId;
	const parsed = NewOrderBodySchema.safeParse({ items: itemsInput, hubId });
	if (!parsed.success) {
		const messages = parsed.error.errors.map((e) => e.message || 'Invalid input');
		return { ok: false, errors: messages };
	}
	return { ok: true, data: parsed.data };
}

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

/**
 * Create a new order from customer cart
 * POST /api/customer/new-order
 * Body: { items: [{ productId: string, price: number }], hubId?: string }
 * @type {app.AsyncRequestHandler}
 */
orderController.createCustomerOrder = async (req, res) => {
    try {
        const user = req.session.user;
        if (!user || !user.id) {
        return res.jsonErrorMsg(['Unauthenticated.']);
    }

    const parsed = parseCustomerNewOrderBody(req);
    if (!parsed.ok) {
        return res.jsonErrorMsg(parsed.errors);
    }

    const { items: itemsInput, hubId: inputHubId } = parsed.data;

    const items = itemsInput.map((it) => ({ product: it.productId, quantity: 1, price: it.price }));

    const totalPrice = items.reduce((sum, it) => sum + it.price, 0);

    let hubId = inputHubId;
    if (!hubId) {
        const hub = await DistributionHub.findOne({}, { _id: 1 });
        if (!hub) {
            return res.jsonErrorMsg(['No distribution hub configured.']);
        }
        hubId = hub._id;
    }

    const order = await Order.create({
        customer: user.id,
        hub: hubId,
        items,
        totalPrice,
        status: 'active',
    });

    return res.jsonData(order);
    } catch (error) {
        console.error('Error creating customer order:', error);
        return res.jsonErrorMsg(['Failed to create order']);
    }
};

export default orderController;
