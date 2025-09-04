import bcrypt from 'bcrypt';

const accountHelper = {};

accountHelper.role = /** @type {const} */({
	VENDOR: 'Vendor',
	SHIPPER: 'Shipper',
	CUSTOMER: 'Customer',
});

accountHelper.hashPassword = async (/** @type {string} */password) => await bcrypt.hash(
	password, process.env.BCRYPT_SALT_ROUNDS,
);

export default accountHelper;
