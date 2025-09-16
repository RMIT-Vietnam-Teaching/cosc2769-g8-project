/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
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
	build: {
		outDir: '../dist',
	},
});
