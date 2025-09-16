import { Product } from '#root/models.js';

const customerProductController = {};

/**
 * List all products for customers
 * @type {app.AsyncRequestHandler}
 */
customerProductController.list = async (_req, res) => {
  try {
    const products = await Product.find({}, { __v: false }, { lean: true })
      .populate('vendor', 'businessName');

    res.jsonData(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.jsonErrorMsg(['Failed to fetch products']);
  }
};

/**
 * Get a single product by id for customers
 * @type {app.AsyncRequestHandler}
 */
customerProductController.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id, { __v: false })
      .populate('vendor', 'businessName');

    if (!product) {
      return res.jsonErrorMsg(['Product not found']);
    }

    res.jsonData(product);
  } catch (error) {
    console.error('Error fetching product detail:', error);
    res.jsonErrorMsg(['Failed to fetch product detail']);
  }
};

export default customerProductController;
