import { fetchHelper } from './fetch';

const helper = {};

helper.role = /** @type {const} */{
	VENDOR: 'Vendor',
	SHIPPER: 'Shipper',
	CUSTOMER: 'Customer',
};

/**
 * @typedef {{ success: boolean, error: Record<string, string[]> }} SignUpState
 * @param {SignUpState} _
 * @param {FormData} formData
 * @returns {Promise<SignUpState>}
 */
helper.signUp = async (_, formData) => {
	try {
		/** @type {app.Response} */
		const res = await fetchHelper.postForm('/api/signup', formData).json();
		await new Promise(resolve => setTimeout(resolve, 400));
		if (res.success) {
			return { success: true, error: {} };
		}
		return { success: false, error: res.error };
	} catch (e) {
		console.error(e);
		return { success: false, error: { __global: ['[Network] Unable to signup!'] } };
	}
};

/**
 * @typedef {{ success: boolean, error: Record<string, string[]> }} UpdateProfilePictureState
 * @param {UpdateProfilePictureState} _
 * @param {FormData} formData
 * @returns {Promise<UpdateProfilePictureState>}
 */
helper.updateProfilePicture = async (_, formData) => {
	try {
		/** @type {app.Response} */
		const res = await fetchHelper.postForm('/api/account/profile-picture', formData).json();
		await new Promise(resolve => setTimeout(resolve, 400));
		if (res.success) {
			return { success: true, error: {} };
		}
		return { success: false, error: res.error };
	} catch (e) {
		console.error(e);
		return { success: false, error: { __global: ['[Network] Unable to update profile picture!'] } };
	}
};

export const accountHelper = helper;
