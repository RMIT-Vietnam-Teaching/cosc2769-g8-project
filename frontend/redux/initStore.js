/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
import { userAction } from './slices/userSlice';

import { fetchHelper } from '#/helpers/fetch';

/**
 * @param {typeof import('./store.js').store} store
 */
export const initStore = async (store) => {
	/** @type {app.Response<app.User>} */
	const res = await fetchHelper.get('/api/account');

	if (res.success) {
		store.dispatch(userAction.setUser(res.data));
		store.dispatch(userAction.check());
	} else {
		store.dispatch(userAction.clearUser());
		store.dispatch(userAction.check());
	}
};
