/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
import { fetchHelper } from '#/helpers/fetch';

export const accountService = {

	/**
	 * @typedef {{ success: boolean, error: Record<string, string[]> }} SignUpState
	 * @param {SignUpState} _
	 * @param {FormData} formData
	 * @returns {Promise<SignUpState>}
	 */
	signUp: async (_, formData) => {
		try {
		/** @type {app.Response} */
			const res = await fetchHelper.postForm('/api/signup', formData);
			await new Promise(resolve => setTimeout(resolve, 400));
			if (res.success) {
				return { success: true, error: {} };
			}
			return { success: false, error: res.error };
		} catch (e) {
			console.error(e);
			return { success: false, error: { __global: ['[Network] Unable to signup!'] } };
		}
	},

	/**
	 * @typedef {{ success: boolean, error: Record<string, string[]> }} UpdateProfilePictureState
	 * @param {UpdateProfilePictureState} _
	 * @param {FormData} formData
	 * @returns {Promise<UpdateProfilePictureState>}
	 */
	updateProfilePicture: async (_, formData) => {
		try {
		/** @type {app.Response} */
			const res = await fetchHelper.postForm('/api/account/profile-picture', formData);
			await new Promise(resolve => setTimeout(resolve, 400));
			if (res.success) {
				return { success: true, error: {} };
			}
			return { success: false, error: res.error };
		} catch (e) {
			console.error(e);
			return { success: false, error: { __global: ['[Network] Unable to update profile picture!'] } };
		}
	},
};
