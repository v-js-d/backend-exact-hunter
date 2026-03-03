const config = {
	'*.ts': ['eslint --fix', 'prettier --write', () => 'tsc --noEmit'],

	'*': 'prettier --write --ignore-unknown',
};

export default config;
