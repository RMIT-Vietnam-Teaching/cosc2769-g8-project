/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Đoàn Đắc Nguyên, Trần Phan Anh Khoa
# ID: s4131473, s4136776
*/
import { fetchHelper } from '#/helpers/fetch';

const API_BASE_URL = '/api';

export const productService = {
	/**
	 * GET: /api/customers/products
	 *
	 * @param {Record<string, string|string[]>} queries
	 */
	async getAll(queries = {}) {
		try {
			/** @type {any} */
			const result = await fetchHelper.get(`${API_BASE_URL}/customers/products`, queries);
			if (result.success && result.data) {
				return result.data;
			} else {
				throw new Error(result.errorMsg?.join(', ') || 'Failed to fetch products');
			}
		} catch (error) {
			console.error('Error fetching products:', error);
			throw error;
		}
	},

	/**
	 * GET: /api/customers/product/:id
	 *
     * @param {string} id
     */
	async getById(id) {
		try {
			const response = await fetch(`${API_BASE_URL}/customers/product/${id}`);
			const result = await response.json();
			if (result.success && result.data) {
				return result.data;
			} else {
				throw new Error(result.errorMsg?.join(', ') || 'Failed to fetch product detail');
			}
		} catch (error) {
			console.error('Error fetching product detail:', error);
			throw error;
		}
	},

	/**
	 * @typedef {object} ProductSearch;
	 * @prop {string} _id
	 * @prop {string} name
	 *
     * @param {string} search
	 * @returns {Promise<ProductSearch[]>}
     */
	async searchByName(search) {
		try {
			/** @type {app.Response<ProductSearch[]>} */
			const result = await fetchHelper.get(`${API_BASE_URL}/customers/products/name`, { search });
			if (result.success) {
				return result.data;
			} else {
				console.error(result.error);
				throw new Error('Failed to fetch products');
			}
		} catch (error) {
			console.error('Error searching products:', error);
			throw error;
		}
	},
};

export default productService;
