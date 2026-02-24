// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import eslintPluginImport from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

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
			'import/no-default-export': 'error',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-floating-promises': 'warn',
			'@typescript-eslint/no-unsafe-argument': 'warn',
			'no-console': 'warn',
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
