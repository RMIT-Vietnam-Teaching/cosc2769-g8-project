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
} from '#root/models.js'; // Replace with the correct path

const seedDataController = {};

// =================================================
// Create unique IDs to link documents together
// =================================================
const vendorId = new mongoose.Types.ObjectId();
const customerId = new mongoose.Types.ObjectId();
const customer2Id = new mongoose.Types.ObjectId();
const customer3Id = new mongoose.Types.ObjectId();
const hubId = new mongoose.Types.ObjectId();
const shipperId = new mongoose.Types.ObjectId();
const productId_1 = new mongoose.Types.ObjectId();
const productId_2 = new mongoose.Types.ObjectId();
const productId_3 = new mongoose.Types.ObjectId();
const orderId_1 = new mongoose.Types.ObjectId();
const orderId_2 = new mongoose.Types.ObjectId();
const orderId_3 = new mongoose.Types.ObjectId();

// =================================================
// Sample Data Objects
// =================================================

const sampleData = {
	users: [
		{
			// This will be a Vendor
			_id: vendorId,
			username: 'vendorUser1',
			password: 'Password@123',
			profilePicture: 'vendor-profile-pic.jpg',
			role: 'Vendor',
			businessName: 'Fresh Produce Co.',
			businessAddress: '123 Market St, Anytown',
		},
		{
			// This will be a Customer
			_id: customerId,
			username: 'customerUser1',
			password: 'Password@123',
			profilePicture: 'customer-profile-pic.jpg',
			role: 'Customer',
			name: 'John Doe',
			address: '456 Elm St, Melbourne VIC 3000',
		},
		{
			// This will be a Customer 2
			_id: customer2Id,
			username: 'customerUser2',
			password: 'Password@123',
			profilePicture: 'customer2-profile-pic.jpg',
			role: 'Customer',
			name: 'Jane Smith',
			address: '789 Collins St, Melbourne VIC 3001',
		},
		{
			// This will be a Customer 3
			_id: customer3Id,
			username: 'customerUser3',
			password: 'Password@123',
			profilePicture: 'customer3-profile-pic.jpg',
			role: 'Customer',
			name: 'Bob Wilson',
			address: '321 Bourke St, Melbourne VIC 3002',
		},
		{
			// This will be a Shipper
			_id: shipperId,
			username: 'shipperUser1',
			password: 'Password@123',
			profilePicture: 'shipper-profile-pic.jpg',
			role: 'Shipper',
			hub: hubId,
		},
	],
	distributionHubs: [
		{
			_id: hubId,
			name: 'Main Distribution Hub',
			address: '789 Warehouse Rd, Melbourne',
		},
	],
	products: [
		{
			_id: productId_1,
			vendor: vendorId,
			name: 'Honeycrisp Apples',
			price: 2.99,
			image: 'https://source.unsplash.com/gDPaDDy6_WE/800x600',
			description: 'Sweet and crisp organic apples from local orchards.',
		},
		{
			_id: productId_2,
			vendor: vendorId,
			name: 'Picked Bananas',
			price: 1.5,
			image: 'https://source.unsplash.com/0v_1TPz1uXw/800x600',
			description: 'Fresh bananas from local farmers, perfectly ripe.',
		},
		{
			_id: productId_3,
			vendor: vendorId,
			name: 'Fresh Oranges',
			price: 3.25,
			image: 'orange-image.jpg',
			description: 'Juicy Valencia oranges, great source of vitamin C.',
		},
	],
	orders: [
		{
			_id: orderId_1,
			customer: customerId,
			hub: hubId,
			items: [
				{ product: productId_1, quantity: 2, price: 2.99 },
				{ product: productId_2, quantity: 1, price: 1.5 },
			],
			totalPrice: 7.48,
			status: 'active',
			createdAt: new Date(),
		},
		{
			_id: orderId_2,
			customer: customer2Id,
			hub: hubId,
			items: [
				{ product: productId_3, quantity: 3, price: 3.25 },
			],
			totalPrice: 9.75,
			status: 'active',
			createdAt: new Date(),
		},
		{
			_id: orderId_3,
			customer: customer3Id,
			hub: hubId,
			items: [
				{ product: productId_1, quantity: 1, price: 2.99 },
				{ product: productId_3, quantity: 2, price: 3.25 },
			],
			totalPrice: 9.49,
			status: 'delivered',
			createdAt: new Date(),
		},
	],
};

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
		await User.insertMany(sampleData.users);
		await DistributionHub.insertMany(sampleData.distributionHubs);
		await Product.insertMany(sampleData.products);
		await Order.insertMany(sampleData.orders);
		console.log('Database seeded successfully!');

		res.jsonOk();
	} catch (error) {
		console.error('Error seeding database:', error);
		res.jsonErrorMsg(['Cannot do this operation!']);
	}
};

export default seedDataController;
