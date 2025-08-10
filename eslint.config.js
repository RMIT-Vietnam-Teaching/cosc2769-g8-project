import { builtinModules } from 'module';

import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
	{
		files: ['**/*.{js,jsx}', './backend/bin/www'],
		ignores: ['node_modules/'],
		languageOptions: {
			globals: { ...globals.node },
		},
		plugins: {
			js,
			'@stylistic': stylistic,
			'@simpleSort': simpleImportSort,
		},
		extends: ['js/recommended'],
		rules: {
			'no-unused-vars': ['error', {
				varsIgnorePattern: '^_',
				argsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_',
				destructuredArrayIgnorePattern: '^_',
				ignoreRestSiblings: true,
			}],

			'no-fallthrough': ['error', { commentPattern: '^ *break *$' }],

			'@stylistic/indent': ['warn', 'tab'],
			'@stylistic/jsx-indent-props': ['warn', 'tab'],
			'@stylistic/indent-binary-ops': ['warn', 'tab'],
			'@stylistic/quotes': ['warn', 'single'],
			'@stylistic/quote-props': ['error', 'as-needed'],
			'@stylistic/jsx-quotes': ['warn', 'prefer-single'],
			'@stylistic/no-extra-semi': 'error',
			'@stylistic/semi': ['warn', 'always'],
			'@stylistic/semi-style': ['warn', 'last'],
			'@stylistic/comma-style': ['warn', 'last'],
			'@stylistic/comma-spacing': 'warn',
			'@stylistic/comma-dangle': ['warn', 'always-multiline'],
			'@stylistic/no-trailing-spaces': 'warn',
			'@stylistic/block-spacing': ['warn', 'always'],
			'@stylistic/arrow-spacing': 'warn',
			'@stylistic/linebreak-style': ['error', 'unix'],
			'@stylistic/eol-last': 'warn',

			'@simpleSort/imports': ['warn', {
				groups: [[
					// Node.js builtins
					'^node:',
					`^(${builtinModules.join('|')})(/|$)`,
				], [
					// React-related imports
					'^react',
					// package imports
					'^\\w',
					'^@\\w',
				], [
					// Alias imports.
					'^#\\w',
					// Parent imports. Put `..` last.
					'^\\.\\.(?!/?$)',
					'^\\.\\./?$',
					// Other relative imports. Put same-folder imports and `.` last.
					'^\\./(?=.*/)(?!/?$)',
					'^\\.(?!/?$)', '^\\./?$',
				], [
					// Side effect imports.
					'^\\u0000',
					// Style imports.
					'^.+\\.s?css$',
				]],
			},
			],
		},
	},

	{
		basePath: 'backend/',
		languageOptions: {
			ecmaVersion: 2023,
			sourceType: 'module',
			globals: { ...globals.node },
		},
	},

	{
		basePath: 'frontend/',
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: { ...globals.browser },
			parserOptions: {
				ecmaFeatures: { jsx: true },
			},
		},
		settings: {
			react: {
				version: '19.1',
			},
		},
		extends: [
			react.configs.flat.recommended,
			react.configs.flat['jsx-runtime'],
			reactHooks.configs['recommended-latest'],
			reactRefresh.configs.vite,
		],
	},
]);
