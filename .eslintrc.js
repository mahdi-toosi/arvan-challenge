module.exports = {
	env: {
		node: true,
		browser: true,
		es2021: true,
	},
	extends: [
		'plugin:vue/vue3-recommended',
		'eslint:recommended',
		'@vue/typescript/recommended',
		'@vue/prettier',
	],
	rules: {
		'vue/require-default-prop': 'off',
		'vue/v-on-event-hyphenation': 'off',
		'vue/no-setup-props-destructure': 'off',
		'@typescript-eslint/no-extra-semi': 'off',
		'vue/multi-word-component-names': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-unused-vars': 'warn',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/consistent-type-imports': 'error',
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
		'vue/no-undef-components': [
			'error',
			{
				ignorePatterns: ['Button', 'Skeleton', 'router-link', 'router-view', 'DataTable', 'Column'],
			},
		],
	},
	settings: {
		vite: { configPath: './vite.config.ts' },
		'import/parsers': { '@typescript-eslint/parser': ['*.ts', '*.tsx'] },
		'import/resolver': {
			node: true,
			typescript: true,
			alias: { map: ['@', './src'] },
			extensions: ['.js', '.ts', '.jsx', '.tsx', '.vue'],
		},
	},
	globals: {
		defineEmits: 'readonly',
		defineProps: 'readonly',
		defineModel: 'readonly',
		withDefaults: 'readonly',
		defineExpose: 'readonly',
		defineOptions: 'readonly',
	},
}
