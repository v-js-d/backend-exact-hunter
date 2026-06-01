// @ts-check
import eslint from '@eslint/js';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
	{
		ignores: ['eslint.config.mjs', '.lintstagedrc.mjs'],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	eslintPluginPrettierRecommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
			},
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		plugins: {
			import: eslintPluginImport,
		},
		rules: {
			// 'import/no-default-export': 'error',
			// 'import/order': 'error',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-floating-promises': 'warn',
			'@typescript-eslint/no-unsafe-argument': 'warn',
			'@typescript-eslint/member-ordering': [
				'error',
				{
					default: [
						'static-field',
						'instance-field',
						'static-method',
						'private-instance-method',
						'protected-instance-method',
						'public-instance-method',
					],
				},
			],
			'no-console': 'error',
			eqeqeq: 'error',
			'no-else-return': 'warn',
			'array-callback-return': 'error',
			'no-await-in-loop': 'error',
			'no-duplicate-imports': 'error',
			'no-promise-executor-return': 'error',
			'no-template-curly-in-string': 'error',
			'require-atomic-updates': 'error',
			camelcase: 'error',
			'default-case': 'error',
			'default-case-last': 'error',
			'prettier/prettier': ['error', { endOfLine: 'auto' }],
		},
	},
);
