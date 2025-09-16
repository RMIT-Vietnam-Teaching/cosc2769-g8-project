/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';

import { store } from './redux/store';
import { appRouter } from './router';

import './main.css';

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
