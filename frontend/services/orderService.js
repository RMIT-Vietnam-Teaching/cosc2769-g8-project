// API service for order management
const API_BASE_URL = 'http://localhost:3000/api';

export const orderService = {
	// Get all orders
	async getAllOrders() {
		try {
			const response = await fetch(`${API_BASE_URL}/orders`);
			const result = await response.json();

			if (result.success && result.data) {
				return result.data;
			} else {
				throw new Error(result.errorMsg?.join(', ') || 'Failed to fetch orders');
			}
		} catch (error) {
			console.error('Error fetching orders:', error);
			throw error;
		}
	},

	// Get orders by hub
	/**
     * @param {string} hubId
     */
	async getOrdersByHub(hubId) {
		try {
			const response = await fetch(`${API_BASE_URL}/orders/hub/${hubId}`);
			const result = await response.json();

			if (result.success && result.data) {
				return result.data;
			} else {
				throw new Error(result.errorMsg?.join(', ') || 'Failed to fetch orders by hub');
			}
		} catch (error) {
			console.error('Error fetching orders by hub:', error);
			throw error;
		}
	},

	// Get single order details
	/**
     * @param {any} orderId
     */
	async getOrderById(orderId) {
		try {
			const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
			const result = await response.json();

			if (result.success && result.data) {
				return result.data;
			} else {
				throw new Error(result.errorMsg?.join(', ') || 'Failed to fetch order details');
			}
		} catch (error) {
			console.error('Error fetching order details:', error);
			throw error;
		}
	},

	// Mark order as delivered
	/**
     * @param {string} orderId
     */
	async markAsDelivered(orderId) {
		try {
			const response = await fetch(`${API_BASE_URL}/orders/${orderId}/delivered`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const result = await response.json();

			if (result.success && result.data) {
				return result.data;
			} else {
				throw new Error(result.errorMsg?.join(', ') || 'Failed to mark order as delivered');
			}
		} catch (error) {
			console.error('Error marking order as delivered:', error);
			throw error;
		}
	},

	// Cancel order
	/**
     * @param {string} orderId
     */
	async cancelOrder(orderId) {
		try {
			const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const result = await response.json();

			if (result.success && result.data) {
				return result.data;
			} else {
				throw new Error(result.errorMsg?.join(', ') || 'Failed to cancel order');
			}
		} catch (error) {
			console.error('Error canceling order:', error);
			throw error;
		}
	},

	// Get order statistics
	async getOrderStats() {
		try {
			const response = await fetch(`${API_BASE_URL}/orders-stats`);
			const result = await response.json();

			if (result.success && result.data) {
				return result.data;
			} else {
				throw new Error(result.errorMsg?.join(', ') || 'Failed to fetch order statistics');
			}
		} catch (error) {
			console.error('Error fetching order statistics:', error);
			throw error;
		}
	},

  // Create new customer order
  /**
   * @param {Array<{ id?: string, _id?: string, product?: string, name?: string, price: number }>} items - Cart products; will be minimized to {productId, price}
   */
    async createCustomerOrder(items) {
        try {
            const payloadItems = Array.isArray(items)
                ? items.map((p) => ({
                    productId: String(p.id ?? ''),
                    price: Number(p.price),
                }))
                : [];

            const response = await fetch(`${API_BASE_URL}/customer/new-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: payloadItems }),
            });
            const result = await response.json();
            if (result.success && result.data) {
                return result.data;
            } else {
                throw new Error(result.errorMsg?.join(', ') || 'Failed to create order');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }
};

export default orderService;
