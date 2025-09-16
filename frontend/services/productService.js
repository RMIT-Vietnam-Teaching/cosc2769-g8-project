const API_BASE_URL = 'http://localhost:3000/api';

export const productService = {
  // GET: /api/customers/products
  async getAll() {
      try {
        const response = await fetch(`${API_BASE_URL}/customers/products`);
        const result = await response.json();
        if (result.success && result.data) {
            return result.data;
        } else {
            throw new Error(result.errorMsg?.join(', ') || 'Failed to fetch products');
        }
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
            }
        },

  // GET: /api/customers/product/:id
    async getById(id) {
      try {
            const response = await fetch(`${API_BASE_URL}/customers/product/${id}`);
            const result = await response.json();
            if (result.success && result.data) {
                return result.data;
            } else {
                throw new Error(result.errorMsg?.join(', ') || 'Failed to fetch product detail');
            }
      } catch (error) {
        console.error('Error fetching product detail:', error);
        throw error;
        }
    },
};

export default productService;
