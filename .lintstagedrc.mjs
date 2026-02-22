export default {
	'*.{ts,tsx}': ['pnpm lint', 'pnpm format', 'pnpm typecheck'],
	'*': 'prettier --write --ignore-unknown',
};
