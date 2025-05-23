import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{ ignores: ['dist'] },
	{
		extends: [js.configs.recommendedTypeChecked, tseslint.configs.recommendedTypeChecked, tseslint.configs.stylisticTypeChecked],
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				project: ['./tsconfig.node.json', './tsconfig.app.json'],
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: {
			react,
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
		},
		settings: {
			react: {
				version: '18.3', // Set the React version
			},
		},
		rules: {
			// React recommended rules
			...react.configs.recommended.rules,
			...react.configs['jsx-runtime'].rules,

			// React Hooks recommended rules
			...reactHooks.configs.recommendedTypeChecked.rules,

			// React Refresh rule
			'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		},
	}
);
