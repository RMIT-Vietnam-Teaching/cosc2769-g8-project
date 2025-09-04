import { configureStore } from '@reduxjs/toolkit';

import { counterReducer } from './slices/counterSlide';
import { userReducer } from './slices/userSlice';
import { initStore } from './initStore';

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		user: userReducer,
	},
});

initStore(store);
