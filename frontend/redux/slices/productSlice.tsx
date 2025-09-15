import { createSlice } from '@reduxjs/toolkit';

interface ProductType {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string[];
}

const initialState = {
	products: []  as ProductType[],
};

export const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        addToCard: (state, action) => {
			state.products.push(action.payload);
        },
        removeToCard: (state, action) => {
			state.products = state.products.filter(product => product.id !== action.payload);
        },
    },
	selectors: {
		products: state => state.products,
	}
});

export const productsReducer = productsSlice.reducer;
export const productsActions = productsSlice.actions;
export const productsSelectors = productsSlice.selectors;
