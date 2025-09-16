import { createBrowserRouter } from 'react-router';

import { accountHelper } from './helpers/account';
import { Layout } from './layout/Layout';
import PageCustomer from './pages/PageCustomer/PageCustomer.js';
import ProductDetail from './pages/PageCustomer/ProductDetail.js';
import { PageLogin } from './pages/PageLogin/PageLogin';
import { PageMyAccount } from './pages/PageMyAccount/PageMyAccount';
import PageShipper from './pages/PageShipper/PageShipper';
import { PageSignup } from './pages/PageSignup/PageSignup';
import { PageSignupCustomer } from './pages/PageSignupCustomer/PageSignupCustomer';
import { PageSignupShipper } from './pages/PageSignupShipper/PageSignupShipper';
import { PageSignupVendor } from './pages/PageSignupVendor/PageSignupVendor';
import { PageVendor } from './pages/PageVendor/PageVendor';
import { PageVendorNewProduct } from './pages/PageVendorNewProduct/PageVendorNewProduct';
import { PageVendorProductDetails } from './pages/PageVendorProductDetails/PageVendorProductDetails';
import { vendorService } from './services/vendorService';

import ShoppingCart from '#/pages/PageCustomer/ShoppingCart.js';
import PageAbout from './pages/PageAbout/PageAbout.jsx';
import PagePrivacy from './pages/PagePrivacy/PagePrivacy.jsx';

export const appRouter = createBrowserRouter([
	{
		Component: Layout,
		handle: {
			defaultRouteForRole: {
				[accountHelper.role.CUSTOMER]: '/customer',
				[accountHelper.role.SHIPPER]: '/shipper',
				[accountHelper.role.VENDOR]: '/vendor',
			},
		},
		children: [
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
				handle: { requireAuth: true, roles: [accountHelper.role.CUSTOMER] },
				path: '/customer',
				Component: PageCustomer,
			},
			{
				handle: { requireAuth: true, roles: [accountHelper.role.CUSTOMER] },
				path: '/product/:id',
				Component: ProductDetail,
			},
			{
				handle: { requireAuth: true, roles: [accountHelper.role.CUSTOMER] },
				path: '/cart',
				Component: ShoppingCart,
			},
			{
				handle: { requireAuth: false },
				path: '/about',
				Component: PageAbout,
			},
			{
				handle: { requireAuth: false },
				path: '/privacy',
				Component: PagePrivacy,
			},
			{
				handle: { requireAuth: true, roles: [accountHelper.role.VENDOR] },
				path: '/vendor',
				Component: PageVendor,
				loader: vendorService.fetchProducts,
			},
			{
				handle: { requireAuth: true, roles: [accountHelper.role.VENDOR] },
				path: '/vendor/product/:id',
				Component: PageVendorProductDetails,
				loader: ({ params }) => vendorService.fetchProduct(params.id ?? 'a'),
			},
			{
				handle: { requireAuth: true, roles: [accountHelper.role.VENDOR] },
				path: '/vendor/new-product',
				Component: PageVendorNewProduct,
			},
			{
				handle: { requireAuth: true, roles: [] },
				path: '*',
				element: null,
			},
		],
	},
]);
