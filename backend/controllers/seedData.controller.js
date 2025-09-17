/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Đoàn Đắc Nguyên, Lê Đạt Nhơn
# ID: s4131473, s4076839
*/
import mongoose from 'mongoose';

import {
	DistributionHub,
	Order,
	Product,
	User,
} from '#root/models.js';

import orders from '../seed/orders.json' with { type: 'json' };
import users from '../seed/users.json' with { type: 'json' };
import products from '../seed/products.json' with { type: 'json' };
import hubs from '../seed/distribution-hubs.json' with { type: 'json' };

import { Long } from 'mongodb';

const seedDataController = {};

/** @type {app.AsyncRequestHandler} */
seedDataController.start = async (_, res) => {
	try {
		// ----------------------------------------------------
		// 1. Drop existing collections to start fresh
		// ----------------------------------------------------
		console.log('Dropping old collections if they exist...');
		if (mongoose.connection.db == null) {
			throw Error('Cannot connect to MongoDB');
		}

		const collections = await mongoose.connection.db.listCollections().toArray();
		const collectionNames = collections.map(c => c.name);

		const collectionsToDrop = ['users', 'distributionhubs', 'products', 'orders'];
		for (const collectionName of collectionsToDrop) {
			if (collectionNames.includes(collectionName)) {
				await mongoose.connection.db.dropCollection(collectionName);
				console.log(`Dropped collection: ${collectionName}`);
			} else {
				console.log(`Collection not found, skipping: ${collectionName}`);
			}
		}
		console.log('Old collections dropped or skipped.');

		// ----------------------------------------------------
		// 2. Insert new documents
		// ----------------------------------------------------
		console.log('Inserting new data...');
		await User.insertMany(reviveMongoTypes(users));
		await DistributionHub.insertMany(reviveMongoTypes(hubs));
		await Product.insertMany(reviveMongoTypes(products));
		await Order.insertMany(reviveMongoTypes(orders));
		console.log('Database seeded successfully!');

		res.jsonOk();
	} catch (error) {
		console.error('Error seeding database:', error);
		res.jsonErrorMsg(['Cannot do this operation!']);
	}
};

/**
 * @param {any} doc
 */
function reviveMongoTypes(doc) {
	if (Array.isArray(doc)) {
		return doc.map(reviveMongoTypes);
	} else if (doc && typeof doc === 'object') {
		if (doc.$oid) {
			return mongoose.Types.ObjectId.createFromHexString(doc.$oid);
		}
		if (doc.$date) {
			return new Date(doc.$date);
		}
		if (doc.$numberLong) {
			// Use Long if you want 64-bit precision, otherwise just Number
			const num = BigInt(doc.$numberLong);
			if (num <= BigInt(Number.MAX_SAFE_INTEGER) && num >= BigInt(Number.MIN_SAFE_INTEGER)) {
				return Number(doc.$numberLong); // ✅ safe as JS number
			}
			return Long.fromString(doc.$numberLong); // ✅ keeps precision
		}

		const newDoc = {};
		for (const [k, v] of Object.entries(doc)) {
			newDoc[k] = reviveMongoTypes(v);
		}
		return newDoc;
	}
	return doc;
}

export default seedDataController;
