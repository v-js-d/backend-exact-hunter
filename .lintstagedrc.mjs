const config = {
	'*.ts': ['eslint --fix', 'prettier --write', () => 'pnpm typecheck'],

	'*': 'prettier --write --ignore-unknown',
};

export default config;
