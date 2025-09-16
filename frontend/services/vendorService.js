/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa, Nguyễn Hoàng Long
# ID: s4136776, s4131459
*/
import { fetchHelper } from '#/helpers/fetch';

export const vendorService = {
	fetchProducts: async () => {
		/** @type {app.Response<import("#/pages/PageVendor/types").VendorProduct[]> } */
		const res = await fetchHelper.get('/api/vendor/products');

		if (res.success) {
			return res.data;
		}
		return [];
	},

	/** @param {string} id */
	fetchProduct: async (id) => {
		/** @type {app.Response<import("#/pages/PageVendor/types").VendorProduct[]> } */
		const res = await fetchHelper.get(`/api/vendor/product/${id}`);

		if (res.success) {
			return res.data;
		}
		return null;
	},
};
