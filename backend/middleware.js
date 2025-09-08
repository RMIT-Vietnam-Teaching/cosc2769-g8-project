import multer from 'multer';

import jsonHelper from './helpers/json.helper.js';
import responseHelper from './helpers/response.helper.js';

const middleware = {};

const storage = multer.diskStorage({
	destination: function (_req, _file, cb) {
		cb(null, './public/uploads');
	},
	filename: function (_req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E5);
		cb(null, `${uniqueSuffix}-${file.originalname}`);
	},
});

middleware.upload = multer({ storage: storage });

/**
 * Not Found middleware
 *
 * @type {app.Middleware}
 */
middleware.notFound = (_, res) => {
	res.status(responseHelper.status.NOT_FOUND).jsonErrorMsg(['Not Found!']);
};

/**
 * Global error handling middleware
 *
 * @type {app.ErrorMiddleware}
 */
middleware.error = (error, _, res, __) => {
	console.error(error);
	res.jsonInternalErrorMsg(['Unexpected error!']);
};

/**
 * JSON response helper middleware
 *
 * @type {app.Middleware}
 */
middleware.jsonResponseHelper = (_, res, next) => {
	res.status(responseHelper.status.PROCESSING);
	res.jsonOk = () => {
		if (res.statusCode === responseHelper.status.PROCESSING) {
			res.status(responseHelper.status.OK);
		}
		res.json(jsonHelper.ok());
	};
	res.jsonData = (data) => {
		if (res.statusCode === responseHelper.status.PROCESSING) {
			res.status(responseHelper.status.OK);
		}
		res.json(jsonHelper.data(data));
	};
	res.jsonRedirect = (url) => {
		res.status(responseHelper.status.OK).json(jsonHelper.redirect(url));
	};
	res.jsonError = (error) => {
		if (res.statusCode === responseHelper.status.PROCESSING) {
			res.status(responseHelper.status.BAD_REQUEST);
		}
		res.json(jsonHelper.error(error));
	};
	res.jsonErrorMsg = (errorMsgs) => {
		if (res.statusCode === responseHelper.status.PROCESSING) {
			res.status(responseHelper.status.BAD_REQUEST);
		}
		res.json(jsonHelper.errorMsg(errorMsgs));
	};
	res.jsonInternalErrorMsg = (errorMsgs) => {
		res.status(responseHelper.status.INTERNAL_ERROR).json(jsonHelper.errorMsg(errorMsgs));
	};
	next();
};

/**
 * GET request only middleware
 *
 * @type {app.Middleware}
 */
middleware.onlyGetRequest = (req, res, next) => {
	if (req.method.toUpperCase().trim() === 'GET') {
		next();
	} else {
		res.status(responseHelper.status.METHOD_NOT_ALLOWED)
			.append('Allow', 'GET').end();
	}
};

/** @type {app.Middleware} */
middleware.isLoggedIn = (req, res, next) => {
	if (req.session.user == null) {
		res
			.status(responseHelper.status.UNAUTHENTICATED)
			.json(jsonHelper.errorMsg(['Need to login!']));
	} else {
		next();
	}
};

/** @type {app.Middleware} */
middleware.isNotLoggedIn = (req, res, next) => {
	if (req.session.user == null) {
		next();
	} else {
		res.jsonErrorMsg(['Only for unauthenticated!']);
	}
};

export default middleware;
