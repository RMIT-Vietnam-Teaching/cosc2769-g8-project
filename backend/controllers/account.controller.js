import { z } from 'zod/v4';

import accountHelper from '#root/helpers/account.helper.js';
import responseHelper from '#root/helpers/response.helper.js';
import validationHelper from '#root/helpers/validation.helper.js';
import { logger } from '#root/logger.js';
import { Customer, DistributionHub, Shipper, User, Vendor } from '#root/models.js';

const accountController = {};

const newBaseUserSchema = z.strictObject({
	username: z.string(
		'Invalid value',
	).min(
		8, 'Must be at lest 8 characters!',
	).max(
		15, 'Must be at most 15 characters!',
	).regex(
		/[a-zA-Z0-9]*/, 'Must not contain invalid character(s)!',
	),
	password: z.string(
		'Invalid value',
	).min(
		8, 'Must be at lest 8 characters!',
	).max(
		20, 'Must be at most 20 characters!',
	).regex(
		/.*[A-Z].*/, 'Must contain at least 1 uppercase letter!',
	).regex(
		/.*[a-z].*/, 'Must contain at least 1 lowercase letter!',
	).regex(
		/.*[0-9].*/, 'Must contain at least 1 digit!',
	).regex(
		/.*[!@#$%^&*].*/, 'Must contain at least 1 special character!',
	).regex(
		/[a-zA-Z0-9!@#$%^&*]*/, 'Must not contain invalid character(s)!',
	),
	profilePicture: z.url('Invalid ').optional(),
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
]);

/** @type {app.AsyncRequestHandler} */
accountController.signup = async (req, res) => {
	const validation = newUserSchema.safeParse(req.body);
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
					password: accountHelper.hashPassword(data.password),
				});

				return res.jsonOk();
			} else if (data.role === accountHelper.role.SHIPPER) {
				const hub = await DistributionHub.findById(data.hub);
				if (hub == null) {
					return res.jsonError({ hub: ['Non-existed Hub!'] });
				}
				await Shipper.create({
					...data,
					password: accountHelper.hashPassword(data.password),
				});
				return res.jsonOk();
			} else if (data.role === accountHelper.role.CUSTOMER) {
				await Customer.create({
					...data,
					password: accountHelper.hashPassword(data.password),
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
			const customer = role === accountHelper.role.CUSTOMER ? await Customer.findOne({ username }) : null;
			const shipper = role === accountHelper.role.SHIPPER ? await Shipper.findOne({ username }) : null;
			const vendor = role === accountHelper.role.SHIPPER ? await Vendor.findOne({ username }) : null;
			const user = customer ?? shipper ?? vendor;

			if (user === null) {
				return res.jsonErrorMsg(['Invalid username/password']);
			}

			if (!(await user.comparePassword(password))) {
				return res.jsonErrorMsg(['Invalid username/password']);
			}

			if (!remember) {
				req.session.cookie.maxAge = undefined;
			}

			if (customer != null) {
				req.session.user = {
					id: user._id.toHexString(),
					name: customer.name,
					role: accountHelper.role.CUSTOMER,
				};
			} else if (vendor != null) {
				req.session.user = {
					id: user._id.toHexString(),
					name: vendor.businessName,
					role: accountHelper.role.VENDOR,
				};
			} else if (shipper != null) {
				req.session.user = {
					id: user._id.toHexString(),
					name: shipper.username,
					role: accountHelper.role.SHIPPER,
				};
			}

			res.jsonData(req.session.user);
		} catch (error) {
			logger.error('LogIn Error %o', error);
			res.jsonInternalErrorMsg(['Unable to login! Please try again later.']);
		}
	} else {
		res.jsonErrorMsg(['Invalid email/password']);
	}
};

/** @type {app.RequestHandler} */
accountController.fetch = (req, res) => {
	if (req.session.user == null) {
		res.status(responseHelper.status.UNAUTHENTICATED).jsonErrorMsg(['Unauthenticated.']);
		return;
	} else {
		res.jsonData(req.session.user);
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
