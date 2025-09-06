import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { Layout } from './layout/Layout';
import { PageIndex } from './pages/PageIndex/PageIndex';
import PageShipper from './pages/PageShipper/PageShipper';

import PageCustomer from './pages/PageCustomer/pageCustomer';
import ProductDetail from './pages/PageCustomer/productDetail';

export const appRouter = createBrowserRouter([{
	Component: Layout,
	children: [
		{
			index: true,
			Component: PageIndex,
		},
		{
			path: '/shipper',
			Component: PageShipper,
		},
		{
			path: '/customer',
			Component: PageCustomer,
		},
		{
			path: '/product/:id',
			Component: ProductDetail,
		},
	],
}]);
