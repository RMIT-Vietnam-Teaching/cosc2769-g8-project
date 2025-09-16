/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
import { builtinModules } from 'module';

import { defineConfig, globalIgnores } from 'eslint/config';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
	globalIgnores(['**/dist']),

	{
		files: ['**/*.{js,jsx}', './backend/bin/www', './frontend/**/*.{ts,tsx}'],
		ignores: ['node_modules/'],
		languageOptions: {
			globals: { ...globals.node },
		},
		plugins: {
			js,
			'@stylistic': stylistic,
			'@simpleSort': simpleImportSort,
		},
		extends: [
			'js/recommended',
			stylistic.configs.recommended,
		],
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
			'@stylistic/no-tabs': ['error', { allowIndentationTabs: true }],
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
			'@stylistic/brace-style': [
				'error', '1tbs',
				{ allowSingleLine: true },
			],
			'@stylistic/arrow-parens': [
				'error', 'as-needed',
				{ requireForBlockBody: true },
			],
			'@stylistic/multiline-ternary': ['warn', 'never'],

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
			}],
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
		files: ['**/*.{js,jsx}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				bootstrap: 'readonly',
			},
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
		rules: {
			'@stylistic/jsx-one-expression-per-line': 'off',
			'@stylistic/jsx-closing-tag-location': ['warn', 'line-aligned'],
			'@stylistic/jsx-max-props-per-line': ['warn', { maximum: 5, when: 'multiline' }],
			'@stylistic/jsx-wrap-multilines': ['warn', {
				declaration: 'parens',
				assignment: 'parens',
				return: 'parens',
				arrow: 'parens',
				condition: 'parens',
				logical: 'parens',
				prop: 'parens',
				propertyValue: 'parens',
			}],
			'react/prop-types': 'off',
			'react-hooks/exhaustive-deps': 'off',
		},
	},

	{
		basePath: 'frontend/',
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				bootstrap: 'readonly',
			},
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
			tseslint.configs.recommended,
			react.configs.flat.recommended,
			react.configs.flat['jsx-runtime'],
			reactHooks.configs['recommended-latest'],
			reactRefresh.configs.vite,
		],
		rules: {
			'@stylistic/jsx-one-expression-per-line': 'off',
			'@stylistic/jsx-closing-tag-location': ['warn', 'line-aligned'],
			'@stylistic/jsx-max-props-per-line': ['warn', { maximum: 5, when: 'multiline' }],
			'@stylistic/jsx-wrap-multilines': ['warn', {
				declaration: 'parens',
				assignment: 'parens',
				return: 'parens',
				arrow: 'parens',
				condition: 'parens',
				logical: 'parens',
				prop: 'parens',
				propertyValue: 'parens',
			}],
			'react/prop-types': 'off',
			'react-hooks/exhaustive-deps': 'off',
			'@stylistic/member-delimiter-style': ['warn',
				{
					multiline: {
						delimiter: 'semi',
						requireLast: true,
					},
					singleline: {
						delimiter: 'comma',
						requireLast: false,
					},
					multilineDetection: 'brackets',
				},
			],
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': ['error', {
				varsIgnorePattern: '^_',
				argsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_',
				destructuredArrayIgnorePattern: '^_',
				ignoreRestSiblings: true,
			}],
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},
]);
