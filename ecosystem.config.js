// eslint-disable-next-line no-undef
module.exports = {
	apps: [
		{
			name: 'api',
			script: './dist/server.js',
			instances: 'max',
			exec_mode: 'cluster',
			env: {
				NODE_ENV: 'development',
			},
			env_test: {
				NODE_ENV: 'test',
			},
			env_staging: {
				NODE_ENV: 'staging',
			},
			env_production: {
				NODE_ENV: 'production',
			},
		},
	],
};
