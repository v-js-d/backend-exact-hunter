export default {
	'*.{ts}': ['eslint --fix', 'prettier --write', 'tsc-files --noEmit --pretty'],
	'*': 'prettier --write --ignore-unknown',
};
// 'tsc-files -p tsconfig.json --noEmit --pretty',
// () => 'tsc -p tsconfig.json --noEmit --pretty'
