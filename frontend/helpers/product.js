/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Nguyễn Hoàng Long
# ID: s4131459
*/
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
