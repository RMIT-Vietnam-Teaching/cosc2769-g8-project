import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';

import { store } from './redux/store';
import { appRouter } from './router';

const root = document.getElementById('root');

if (root != null) {
	ReactDOM.createRoot(root).render(
		<React.StrictMode>
			<Provider store={store}>
				<RouterProvider router={appRouter} />
			</Provider>
		</React.StrictMode>,
	);
}
