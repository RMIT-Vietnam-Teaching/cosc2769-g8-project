/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
import { configureStore } from '@reduxjs/toolkit';

import { counterReducer } from './slices/counterSlide';
import { userReducer } from './slices/userSlice';
import { initStore } from './initStore';
import { productsReducer } from "./slices/productSlice.js";

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		user: userReducer,
        products: productsReducer,
	},
});

initStore(store);
