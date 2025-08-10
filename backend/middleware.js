import jsonHelper from './helpers/json.helper.js';
import responseHelper from './helpers/response.helper.js';

const middleware = {};

/**
 * Not Found
 * @type {app.Middleware}
 */
middleware.notFound = (_, res) => {
	res.status(responseHelper.status.NOT_FOUND).end();
};

/**
 * Fallback for all error
 * @type {app.ErrorMiddleware}
 */
middleware.error = (error, _, res, __) => {
	console.error(error);
	res.status(responseHelper.status.INTERNAL_ERROR).end();
};

/** @type {app.Middleware} */
middleware.jsonResponseHelper = (_, res, next) => {
	res.jsonOk = () => {
		res.status(responseHelper.status.OK).json(jsonHelper.ok());
	};
	res.jsonData = (data) => {
		res.status(responseHelper.status.OK).json(jsonHelper.data(data));
	};
	res.jsonRedirect = (url) => {
		res.status(responseHelper.status.OK).json(jsonHelper.redirect(url));
	};
	res.jsonError = (error) => {
		res.status(responseHelper.status.BAD_REQUEST).json(jsonHelper.error(error));
	};
	res.jsonErrorMsg = (errorMsgs) => {
		res.status(responseHelper.status.BAD_REQUEST).json(jsonHelper.errorMsg(errorMsgs));
	};
	next();
};

/** @type {app.Middleware} */
middleware.onlyGetRequest = (req, res, next) => {
	if (req.method.toUpperCase().trim() === 'GET') {
		next();
	} else {
		res.status(responseHelper.status.METHOD_NOT_ALLOWED)
			.append('Allow', 'GET').end();
	}
};

export default middleware;
