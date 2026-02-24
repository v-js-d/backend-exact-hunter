export default {
	'*.{ts,tsx}': ['pnpm lint', 'pnpm format'],
	'*': 'prettier --write --ignore-unknown',
};
