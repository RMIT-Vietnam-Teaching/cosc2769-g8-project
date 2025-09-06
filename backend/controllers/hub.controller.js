import { logger } from '#root/logger.js';
import { DistributionHub } from '#root/models.js';

const hubController = {};

/** @type {app.AsyncRequestHandler} */
hubController.listAll = async (_req, res) => {
	try {
		return res.jsonData(await DistributionHub.find(
			{},
			{ createdAt: false, updatedAt: false, __v: false },
			{ lean: true },
		));
	} catch (e) {
		logger.error('Hub List All Error %o', e);
	}
};

export default hubController;
