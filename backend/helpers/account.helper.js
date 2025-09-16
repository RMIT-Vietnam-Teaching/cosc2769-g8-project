/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
import bcrypt from 'bcrypt';

const accountHelper = {};

accountHelper.role = /** @type {const} */({
	VENDOR: 'Vendor',
	SHIPPER: 'Shipper',
	CUSTOMER: 'Customer',
});

accountHelper.hashPassword = async (/** @type {string} */password) => await bcrypt.hash(
	password, Number(process.env.BCRYPT_SALT_ROUNDS),
);

export default accountHelper;
