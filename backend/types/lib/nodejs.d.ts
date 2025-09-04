namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: 'development' | 'production';
		DATABASE_URL: string;
		SESSION_SECRET_KEY: string;
		PORT: string | undefined;
		BCRYPT_SALT_ROUNDS: number;
	}
}
