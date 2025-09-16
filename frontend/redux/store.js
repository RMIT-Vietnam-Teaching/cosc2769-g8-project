/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/

import { configureStore } from '@reduxjs/toolkit';

import { productsReducer } from './slices/productSlice.js';
import { userReducer } from './slices/userSlice';
import { initStore } from './initStore';

export const store = configureStore({
	reducer: {
		user: userReducer,
		products: productsReducer,
	},
});

initStore(store);

/**
 * @typedef {ReturnType<typeof store.getState>} RootState
 * @typedef {typeof store.dispatch} AppDispatch
 * @typedef {typeof store} AppStore
 */
