import { createBrowserRouter } from 'react-router';

import { Layout } from './layout/Layout';
import { PageIndex } from './pages/PageIndex/PageIndex';
import PageShipper from './pages/PageShipper/PageShipper';

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
	],
}]);
