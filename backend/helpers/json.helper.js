const jsonHelper = {};

jsonHelper.ok = () => ({
	success: true,
});

jsonHelper.data = (data) => ({
	success: true,
	data,
});

jsonHelper.redirect = (url) => ({
	success: true,
	redirect: url,
});

jsonHelper.error = (error) => ({
	success: false,
	error,
});

jsonHelper.errorMsg = (errorMsgs) => ({
	success: false,
	errorMsgs,
});

export default jsonHelper;
