/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
const responseHelper = {};

responseHelper.status = /** @type {const} */ ({
	PROCESSING: 102,
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
