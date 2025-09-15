import ky from 'ky';

import { userAction } from './slices/userSlice';

/**
 * @param {typeof import('./store.js').store} store
 */
export const initStore = async (store) => {
	/** @type {app.Response<app.User>} */
	const res = await ky.get('/api/account', { throwHttpErrors: false }).json();

	if (res.success) {
		store.dispatch(userAction.setUser(res.data));
		store.dispatch(userAction.check());
	} else {
		store.dispatch(userAction.clearUser());
		store.dispatch(userAction.check());
	}
};
