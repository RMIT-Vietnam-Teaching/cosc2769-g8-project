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
