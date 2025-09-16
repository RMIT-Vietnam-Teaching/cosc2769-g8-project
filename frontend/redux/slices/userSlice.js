/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
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
		id: state => state.info?.id ?? null,
		role: state => state.info?.role,
	},
});

// Action creators are generated for each case reducer function
export const userAction = userSlice.actions;
export const userSelect = userSlice.selectors;
export const userReducer = userSlice.reducer;
