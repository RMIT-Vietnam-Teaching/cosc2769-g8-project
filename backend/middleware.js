import jsonHelper from './helpers/json.helper.js';
import responseHelper from './helpers/response.helper.js';

const middleware = {};

/**
 * Not Found middleware
 */
middleware.notFound = (_, res) => {
	res.status(responseHelper.status.NOT_FOUND).end();
};

/**
 * Global error handling middleware
 */
middleware.error = (error, _, res, __) => {
	console.error(error);
	res.status(responseHelper.status.INTERNAL_ERROR).end();
};

/**
 * JSON response helper middleware
 */
middleware.jsonResponseHelper = (_, res, next) => {
	res.jsonOk = () => res.status(responseHelper.status.OK).json(jsonHelper.ok());
	res.jsonData = (data) => res.status(responseHelper.status.OK).json(jsonHelper.data(data));
	res.jsonRedirect = (url) => res.status(responseHelper.status.OK).json(jsonHelper.redirect(url));
	res.jsonError = (error) => res.status(responseHelper.status.BAD_REQUEST).json(jsonHelper.error(error));
	res.jsonErrorMsg = (errorMsgs) => res.status(responseHelper.status.BAD_REQUEST).json(jsonHelper.errorMsg(errorMsgs));
	next();
};

/**
 * GET request only middleware
 */
middleware.onlyGetRequest = (req, res, next) => {
	if (req.method.toUpperCase().trim() === 'GET') {
		next();
	} else {
		res.status(responseHelper.status.METHOD_NOT_ALLOWED)
			.append('Allow', 'GET').end();
	}
};

export default middleware;
