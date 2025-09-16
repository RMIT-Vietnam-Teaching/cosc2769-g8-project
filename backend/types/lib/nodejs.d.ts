/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: 'development' | 'production';
		DATABASE_URL: string;
		SESSION_SECRET_KEY: string;
		PORT: string | undefined;
		BCRYPT_SALT_ROUNDS: number;
	}
}
