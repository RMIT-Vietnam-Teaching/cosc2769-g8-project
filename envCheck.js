const requiredEnv = [
	'NODE_ENV',
	'PORT',
	'DATABASE_URL',
];

requiredEnv.forEach(key => {
	if (typeof process.env[key] !== 'string') {
		console.log(`Env ${key} is missing! Please check .env.template and add ${key} into .env`);
		process.exit(1);
	}
});

process.exit(0);
