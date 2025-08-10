import { createBrowserRouter } from 'react-router';

import { Layout } from './layout/Layout';
import { PageIndex } from './pages/PageIndex/PageIndex';

export const appRouter = createBrowserRouter([{
	Component: Layout,
	children: [
		{
			index: true,
			Component: PageIndex,
		},
	],
}]);
