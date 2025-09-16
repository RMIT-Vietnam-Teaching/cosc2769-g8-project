const helper = {};

/**
 * @param {number} price
 * @returns {string}
 */
helper.displayPrice = (price) => {
	return price.toLocaleString('us-EN', {
		style: 'currency',
		currency: 'USD',
	});
};

export const productHelper = helper;
