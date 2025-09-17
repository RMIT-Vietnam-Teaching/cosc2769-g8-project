/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa, Đỗ Phúc Danh
# ID: s4136776, s4133678
*/
import { millisecondsInDay } from 'date-fns/constants';
import { z } from 'zod/v4';

import accountHelper from '#root/helpers/account.helper.js';
import responseHelper from '#root/helpers/response.helper.js';
import validationHelper from '#root/helpers/validation.helper.js';
import { logger } from '#root/logger.js';
import { Customer, DistributionHub, Shipper, User, Vendor } from '#root/models.js';

const accountController = {};

const newBaseUserSchema = z.strictObject({
	username: z
		.string('Invalid value')
		.refine(({ length: len }) => len >= 8 && len <= 15, 'Must be 8 - 15 characters')
		.regex(/[a-zA-Z0-9]*/, 'Must not contain invalid character(s)!'),
	password: z
		.string('Invalid value')
		.refine(({ length: len }) => len >= 8 && len <= 20, 'Must be 8 - 20 characters')
		.refine(
			x => x.match(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).*/) != null,
			'Must include lowercase, uppercase, digit and special character!',
		).regex(
			/^[a-zA-Z0-9!@#$%^&*]*$/, 'Must not contain invalid character(s)!',
		),
	confirmPassword: z.string('Invalid value'),
	profilePicture: z.string().optional(),
});

const textFieldSchema = z
	.string('Invalid name')
	.refine(x => x.trim().length >= 5, 'Must be at least 5 characters!')
	.trim();

const newUserSchema = z.discriminatedUnion('role', [
	z.strictObject({
		...newBaseUserSchema.shape,
		role: z.literal(accountHelper.role.VENDOR),
		businessName: textFieldSchema,
		businessAddress: textFieldSchema,
	}),
	z.strictObject({
		...newBaseUserSchema.shape,
		role: z.literal(accountHelper.role.SHIPPER),
		hub: z.string('Invalid Hub').nonempty('Invalid Hub'),
	}),
	z.strictObject({
		...newBaseUserSchema.shape,
		role: z.literal(accountHelper.role.CUSTOMER),
		name: textFieldSchema,
		address: textFieldSchema,
	}),
]).check(({ value: { password, confirmPassword }, issues }) => {
	if (password.length !== 0 && confirmPassword.length === 0) {
		issues.push(validationHelper.customIssue(['confirmPassword'], 'Please fill in to confirm your password!'));
	} else if (password.length !== 0 && confirmPassword !== password) {
		issues.push(validationHelper.customIssue(['confirmPassword'], 'Must match entered password!'));
	}
});

/** @type {app.AsyncRequestHandler} */
accountController.signup = async (req, res) => {
	const body = { ...req.body, profilePicture: req.file?.filename ?? undefined };
	const validation = newUserSchema.safeParse(body);
	if (validation.success) {
		const data = validation.data;

		try {
			/** check if user exist */
			const user = await User.findOne({ username: data.username });
			if (user != null) {
				return res.jsonError({ username: ['Already exists!'] });
			}

			if (data.role === accountHelper.role.VENDOR) {
				const vendors = await Vendor.find({ $or: [
					{ businessName: data.businessName },
					{ businessAddress: data.businessAddress },
				] });

				const [matchName, matchAddress] = vendors.reduce(
					([m1, m2], v) => [
						m1 || v.businessName === data.businessName,
						m2 || v.businessAddress === data.businessAddress,
					],
					[false, false],
				);

				/** @type {Record<string, string[]>} */
				const error = {};
				if (matchName) {
					error.businessName = ['Already existed name!'];
				}
				if (matchAddress) {
					error.businessAddress = ['Already existed address!'];
				}

				/** check if either business name or business address exist */
				if (matchName || matchAddress) {
					return res.jsonError(error);
				}

				await Vendor.create({
					...data,
					password: await accountHelper.hashPassword(data.password),
				});

				return res.jsonOk();
			} else if (data.role === accountHelper.role.SHIPPER) {
				const hub = await DistributionHub.findById(data.hub);
				if (hub == null) {
					return res.jsonError({ hub: ['Non-existed Hub!'] });
				}
				await Shipper.create({
					...data,
					password: await accountHelper.hashPassword(data.password),
				});
				return res.jsonOk();
			} else if (data.role === accountHelper.role.CUSTOMER) {
				await Customer.create({
					...data,
					password: await accountHelper.hashPassword(data.password),
				});
				return res.jsonOk();
			}
		} catch (error) {
			logger.error('Create new user Error %o', error);
			return res.jsonInternalErrorMsg(['Unable to sign you up!']);
		}
	} else {
		res.jsonError(validationHelper.groupIssues(validation.error.issues));
	}
};

const loginSchema = z.looseObject({
	username: z.string(),
	password: z.string(),
	role: z.literal(Object.values(accountHelper.role)),
	remember: z.boolean(),
});

/** @type {app.AsyncRequestHandler} */
accountController.login = async (req, res) => {
	const validation = loginSchema.safeParse(req.body);
	if (validation.success) {
		try {
			const { username, password, remember, role } = validation.data;
			const customer = role === accountHelper.role.CUSTOMER ? await Customer.findOne({ username }, '+password') : null;
			const shipper = role === accountHelper.role.SHIPPER ? await Shipper.findOne({ username }, '+password') : null;
			const vendor = role === accountHelper.role.VENDOR ? await Vendor.findOne({ username }, '+password') : null;
			const user = customer ?? shipper ?? vendor;

			if (user === null) {
				console.log('Not Exist!!');
				return res.jsonErrorMsg(['Invalid username/password!']);
			}

			if (!(await user.comparePassword(password))) {
				console.log('Wrong Password!!');
				return res.jsonErrorMsg(['Invalid username/password!']);
			}

			if (remember) {
				req.session.cookie.maxAge = 14 * millisecondsInDay;
			} else {
				req.session.cookie.maxAge = 1 * millisecondsInDay;
			}

			if (customer != null) {
				req.session.user = {
					id: user._id.toHexString(),
					name: customer.name,
					role: accountHelper.role.CUSTOMER,
					img: customer.profilePicture,
				};
			} else if (vendor != null) {
				req.session.user = {
					id: user._id.toHexString(),
					name: vendor.businessName,
					role: accountHelper.role.VENDOR,
					img: vendor.profilePicture,
				};
			} else if (shipper != null) {
				req.session.user = {
					id: user._id.toHexString(),
					name: shipper.username,
					role: accountHelper.role.SHIPPER,
					img: shipper.profilePicture,
				};
			}

			res.jsonData(req.session.user);
		} catch (error) {
			logger.error('LogIn Error %o', error);
			res.jsonInternalErrorMsg(['Unable to login! Please try again later.']);
		}
	} else {
		logger.error('LogIn Validation Error %o', validation.error);
		res.jsonErrorMsg(['Invalid username/password!']);
	}
};

/** @type {app.RequestHandler} */
accountController.fetch = (req, res) => {
	console.log('Fetch user data');
	if (req.session.user == null) {
		return res.status(responseHelper.status.UNAUTHENTICATED).jsonErrorMsg(['Unauthenticated.']);
	} else {
		res.jsonData(req.session.user);
	}
};

/** @type {app.AsyncRequestHandler} */
accountController.fetchProfile = async (req, res) => {
	console.log('Fetch detailed user profile');
	if (req.session.user == null) {
		return res.status(responseHelper.status.UNAUTHENTICATED).jsonErrorMsg(['Unauthenticated.']);
	}

	try {
		const userId = req.session.user.id;
		const role = req.session.user.role;

		let userData = null;

		if (role === accountHelper.role.VENDOR) {
			userData = await Vendor.findById(userId).select('-password');
		} else if (role === accountHelper.role.CUSTOMER) {
			userData = await Customer.findById(userId).select('-password');
		} else if (role === accountHelper.role.SHIPPER) {
			userData = await Shipper.findById(userId).populate('hub').select('-password');
		}

		if (userData == null) {
			return res.status(responseHelper.status.NOT_FOUND).jsonErrorMsg(['User not found.']);
		}

		res.jsonData(userData);
	} catch (error) {
		logger.error('Fetch Profile Error %o', error);
		res.jsonInternalErrorMsg(['Unable to fetch profile data.']);
	}
};

/** @type {app.AsyncRequestHandler} */
accountController.updateProfilePicture = async (req, res) => {
	if (req.session.user == null) {
		return res.status(responseHelper.status.UNAUTHENTICATED).jsonErrorMsg(['Unauthenticated.']);
	}

	if (!req.file) {
		return res.jsonError({ profilePicture: ['No file uploaded.'] });
	}

	try {
		const userId = req.session.user.id;
		const role = req.session.user.role;
		const filename = req.file.filename;

		if (role === accountHelper.role.VENDOR) {
			await Vendor.findByIdAndUpdate(userId, { profilePicture: filename });
		} else if (role === accountHelper.role.CUSTOMER) {
			await Customer.findByIdAndUpdate(userId, { profilePicture: filename });
		} else if (role === accountHelper.role.SHIPPER) {
			await Shipper.findByIdAndUpdate(userId, { profilePicture: filename });
		}

		res.jsonOk();
	} catch (error) {
		logger.error('Update Profile Picture Error %o', error);
		res.jsonInternalErrorMsg(['Unable to update profile picture.']);
	}
};

/** @type {app.RequestHandler} */
accountController.logout = (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			return res.jsonInternalErrorMsg(['Cannot log you out. Please try again.']);
		} else {
			res.jsonOk();
		}
	});
};

export default accountController;
