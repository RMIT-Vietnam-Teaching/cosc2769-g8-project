import { createSlice } from '@reduxjs/toolkit';

/**
 * @template T
 * @typedef {{ type: string; payload: T; }} Action;
 */

/**
 * @type {{
 *     info: app.User | null;
 *     isAuthenticated: boolean;
 *     isChecked: boolean;
 * }}
 */
const initialState = {
	info: null,
	isAuthenticated: false,
	isChecked: false,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		/** @param {Action<app.User>} action */
		setUser: (state, action) => {
			state.info = action.payload;
			state.isAuthenticated = true;
		},

		clearUser: (state) => {
			state.info = null;
			state.isAuthenticated = false;
		},

		check: (state) => {
			state.isChecked = true;
		},
	},

	selectors: {
		info: state => state.info,
		isAuthenticated: state => state.isAuthenticated,
		isChecked: state => state.isChecked,
		isAdmin: state => state.info?.role === 'admin',
		id: state => state.info?.id ?? null,
	},
});

// Action creators are generated for each case reducer function
export const userAction = userSlice.actions;
export const userSelect = userSlice.selectors;
export const userReducer = userSlice.reducer;
