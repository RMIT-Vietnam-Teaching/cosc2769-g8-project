import path from 'node:path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	root: path.resolve(__dirname, './frontend'),
	publicDir: false,
	resolve: {
		alias: {
			'#': path.resolve(__dirname, './frontend'),
		},
	},
	plugins: [react()],
});
