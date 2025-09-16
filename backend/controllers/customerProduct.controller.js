/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
import { z } from 'zod/v4';

import validationHelper from '#root/helpers/validation.helper.js';
import { logger } from '#root/logger.js';
import { Product } from '#root/models.js';

const customerProductController = {};

const listSchema = z.strictObject({
	search: z.string().optional(),
	priceFrom: z.coerce.number().optional(),
	priceTo: z.coerce.number().optional(),
	sort: z.literal(['latest', 'priceDesc', 'priceAsc']).optional(),
}).check(
	({ value: { priceFrom, priceTo }, issues }) => {
		if (priceFrom != null && priceTo != null && priceFrom > priceTo) {
			issues.push(validationHelper.customIssue(['priceFrom'], 'Invalid range!'));
			issues.push(validationHelper.customIssue(['priceTo'], 'Invalid range!'));
		}
	},
);

/** @param {ReturnType<typeof listSchema.parse>} q */
const processQuery = (q) => {
	const query = {};
	const sort = {};
	if (q.search != null) {
		query.name = new RegExp(q.search, 'i');
	}
	if (q.priceFrom != null) {
		query.price = {
			$gte: q.priceFrom,
		};
	}

	if (q.priceTo != null) {
		query.price = {
			...(query.price ?? {}),
			$lte: q.priceTo,
		};
	}

	switch (q.sort) {
		case 'latest':
			sort.createdAt = -1;
			break;
		case 'priceAsc':
			sort.price = 1;
			break;
		case 'priceDesc':
			sort.price = -1;
			break;
	}
	return { query, sort };
};

/**
 * List all products for customers
 * @type {app.AsyncRequestHandler}
 */
customerProductController.list = async (req, res) => {
	const validation = listSchema.safeParse(req.query);

	if (!validation.success) {
		return res.jsonError(validationHelper.groupIssues(validation.error.issues));
	}

	try {
		const { query, sort } = processQuery(validation.data);

		const products = await Product.find(query, { __v: false }, { lean: true, sort })
			.populate('vendor', 'businessName');

		res.jsonData(products);
	} catch (error) {
		console.error('Error fetching products:', error);
		res.jsonErrorMsg(['Failed to fetch products']);
	}
};

/**
 * Get a single product by id for customers
 * @type {app.AsyncRequestHandler}
 */
customerProductController.getById = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await Product.findById(id, { __v: false })
			.populate('vendor', 'businessName');

		if (!product) {
			return res.jsonErrorMsg(['Product not found']);
		}

		res.jsonData(product);
	} catch (error) {
		console.error('Error fetching product detail:', error);
		res.jsonErrorMsg(['Failed to fetch product detail']);
	}
};

/** @type {app.AsyncRequestHandler} */
customerProductController.getByName = async (req, res) => {
	const search = z.string().catch('').parse(req.query.search);

	if (search == '') {
		return res.jsonData([]);
	}

	try {
		const products = await Product.find({
			name: new RegExp(search, 'i'),
		}, { _id: true, name: true }, { lean: true, sort: { createdAt: -1 }, limit: 5 });

		return res.jsonData(products);
	} catch (error) {
		logger.error('[Customer Product Name Filter Error] %o', error);
		return res.jsonInternalErrorMsg(['Unable to filter']);
	}
};

export default customerProductController;
