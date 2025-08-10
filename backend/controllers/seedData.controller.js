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
const hubId = new mongoose.Types.ObjectId();
const shipperId = new mongoose.Types.ObjectId();
const productId_1 = new mongoose.Types.ObjectId();
const productId_2 = new mongoose.Types.ObjectId();
const orderId = new mongoose.Types.ObjectId();

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
			address: '456 Elm St, Anytown',
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
			address: '789 Warehouse Rd, Anytown',
		},
	],
	products: [
		{
			_id: productId_1,
			vendor: vendorId,
			name: 'Honeycrisp Apples',
			price: 2.99,
			image: 'apple-image.jpg',
			description: 'Sweet and crisp organic apples.',
		},
		{
			_id: productId_2,
			vendor: vendorId,
			name: 'Picked Bananas',
			price: 1.5,
			image: 'banana-image.jpg',
			description: 'Bananas from local farmers.',
		},
	],
	orders: [
		{
			_id: orderId,
			customer: customerId,
			hub: hubId,
			items: [
				{
					product: productId_1,
					quantity: 5,
					price: 2.99, // Snapshot price
				},
				{
					product: productId_2,
					quantity: 3,
					price: 1.5,
				},
			],
			totalPrice: 19.45, // (5 * 2.99) + (3 * 1.5)
			status: 'active',
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
