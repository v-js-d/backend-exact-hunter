export default {
	'*.{ts,tsx}': ['eslint --fix', 'prettier --write', () => 'tsc -p tsconfig.json --noEmit --pretty'],
	'*': 'prettier --write --ignore-unknown',
};
// 'tsc-files -p tsconfig.json --noEmit --pretty',
// () => 'tsc -p tsconfig.json --noEmit --pretty'
