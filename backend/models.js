/**
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: <Your Name>
# ID: <Your Student ID>
*/

import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import accountHelper from './helpers/account.helper.js';

// All schemas add createdAt/updatedAt automatically
const timeOpts = { timestamps: true };

// =================================================
// Base User schema (discriminator root)
// =================================================
const BaseUserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		profilePicture: {
			type: String, // store the filename or S3/Cloudinary key
			required: true,
			minlength: 5,
		},
	},
	{
		...timeOpts,
		collection: 'users',
		discriminatorKey: 'role',
		methods: {
			/** @param {string} candidate */
			comparePassword: async function (candidate) {
				return await bcrypt.compare(candidate, this.password);
			},
		},
	},
);

export const User = mongoose.model('User', BaseUserSchema);

// =================================================
// Vendor schema
// =================================================
const VendorSchema = new mongoose.Schema(
	{
		businessName: {
			type: String,
			required: true,
			minlength: 5,
		},
		businessAddress: {
			type: String,
			required: true,
			minlength: 5,
		},
	},
	timeOpts,
);
// Ensure businessName & businessAddress are unique **among vendors only**
VendorSchema.index(
	{ businessName: 1 },
	{ unique: true, partialFilterExpression: { role: accountHelper.role.VENDOR } },
);
VendorSchema.index(
	{ businessAddress: 1 },
	{ unique: true, partialFilterExpression: { role: accountHelper.role.VENDOR } },
);

export const Vendor = User.discriminator(accountHelper.role.VENDOR, VendorSchema);

// =================================================
// Customer schema
// =================================================
const CustomerSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			minlength: 5,
		},
		address: {
			type: String,
			required: true,
			minlength: 5,
		},
	},
	timeOpts,
);
export const Customer = User.discriminator(accountHelper.role.CUSTOMER, CustomerSchema);

// =================================================
// Distribution Hub schema
// =================================================
const DistributionHubSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true, minlength: 3 },
		address: { type: String, required: true, unique: true, minlength: 5 },
	},
	timeOpts,
);
export const DistributionHub = mongoose.model('DistributionHub', DistributionHubSchema);

// =================================================
// Shipper schema
// =================================================
const ShipperSchema = new mongoose.Schema(
	{
		hub: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'DistributionHub',
			required: true,
		},
	},
	timeOpts,
);
export const Shipper = User.discriminator(accountHelper.role.SHIPPER, ShipperSchema);

// =================================================
// Product schema
// =================================================
const ProductSchema = new mongoose.Schema(
	{
		vendor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Vendor',
			required: true,
			index: true,
		},
		name: {
			type: String,
			required: true,
			minlength: 10,
			maxlength: 20,
		},
		price: { type: Number, required: true, min: 0 },
		image: { type: String, required: true, minlength: 5 },
		description: { type: String, maxlength: 500 },
	},
	timeOpts,
);
export const Product = mongoose.model('Product', ProductSchema);

// =================================================
// Order & OrderItem schema
// =================================================
const OrderItemSchema = new mongoose.Schema(
	{
		product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
		quantity: { type: Number, default: 1, min: 1 },
		price: { type: Number, required: true, min: 0 }, // snapshot price
	},
	{ _id: false },
);

const OrderSchema = new mongoose.Schema(
	{
		customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
		hub: { type: mongoose.Schema.Types.ObjectId, ref: 'DistributionHub', required: true },
		items: { type: [OrderItemSchema], required: true },
		totalPrice: { type: Number, required: true, min: 0 },
		status: {
			type: String,
			enum: ['active', 'delivered', 'canceled'],
			default: 'active',
		},
	},
	timeOpts,
);
export const Order = mongoose.model('Order', OrderSchema);
