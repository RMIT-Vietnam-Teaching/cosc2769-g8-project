const responseHelper = {};

responseHelper.status = /** @type {const} */ ({
	OK: 200,
	CREATED: 201,
	BAD_REQUEST: 400,
	UNAUTHENTICATED: 401,
	UNAUTHORIZED: 403,
	NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,
	TOO_MANY_REQUESTS: 429,
	INTERNAL_ERROR: 500,
});

export default responseHelper;
