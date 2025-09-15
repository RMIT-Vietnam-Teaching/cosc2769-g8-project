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
