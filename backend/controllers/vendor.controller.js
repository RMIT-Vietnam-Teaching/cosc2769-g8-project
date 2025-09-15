import { logger } from '#root/logger.js';
import { Product } from '#root/models.js';

const vendorController = {};

/** @type {app.AsyncRequestHandler} */
vendorController.getAll = async (req, res) => {
	const id = req.session.user?.id;
	try {
		const list = await Product.find({ vendor: id });
		res.jsonData(list);
	} catch (e) {
		logger.error('[Vendor List Error] %o', e);
		res.jsonErrorMsg(['Unable to list products for this vendor!']);
	}
};

export default vendorController;
