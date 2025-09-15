import { createBrowserRouter } from 'react-router';

import { accountHelper } from './helpers/account';
import { Layout } from './layout/Layout';
import { PageIndex } from './pages/PageIndex/PageIndex';
import { PageLogin } from './pages/PageLogin/PageLogin';
import { PageMyAccount } from './pages/PageMyAccount/PageMyAccount';
import PageShipper from './pages/PageShipper/PageShipper';
import { PageSignup } from './pages/PageSignup/PageSignup';
import { PageSignupCustomer } from './pages/PageSignupCustomer/PageSignupCustomer';
import { PageSignupShipper } from './pages/PageSignupShipper/PageSignupShipper';
import { PageSignupVendor } from './pages/PageSignupVendor/PageSignupVendor';

import PageCustomer from './pages/PageCustomer/pageCustomer';
import ProductDetail from './pages/PageCustomer/productDetail';

export const appRouter = createBrowserRouter([{
	Component: Layout,
	handle: {
		defaultRouteForRole: {
			[accountHelper.role.CUSTOMER]: '/index',
			[accountHelper.role.SHIPPER]: '/shipper',
			[accountHelper.role.VENDOR]: '/index',
		},
	},
	children: [
		{
			handle: { requireAuth: true },
			path: '/index',
			Component: PageIndex,
		},
		{
			handle: { requireAuth: true },
			path: '/my-account',
			Component: PageMyAccount,
		},
		{
			handle: { requireAuth: false },
			path: '/signup',
			Component: PageSignup,
		},
		{
			handle: { requireAuth: false },
			path: '/signup/customer',
			Component: PageSignupCustomer,
		},
		{
			handle: { requireAuth: false },
			path: '/signup/shipper',
			Component: PageSignupShipper,
		},
		{
			handle: { requireAuth: false },
			path: '/signup/vendor',
			Component: PageSignupVendor,
		},
		{
			handle: { requireAuth: false },
			path: '/login',
			Component: PageLogin,
		},
		{
			handle: { requireAuth: true, roles: [accountHelper.role.SHIPPER] },
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
		{
			handle: { requireAuth: true, roles: [] },
			path: '*',
			element: null,
		},
	],
}]);
