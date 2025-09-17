/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Đoàn Đắc Nguyên
# ID: s4131473
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
