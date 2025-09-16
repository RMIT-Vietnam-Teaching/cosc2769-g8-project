/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Trần Phan Anh Khoa
# ID: s4136776
*/
import morgan from 'morgan';
import winston, { format } from 'winston';

morgan.token('paddedMethod', req => req.method?.padEnd(5));

morgan.token('userId', (/** @type {app.ExpressRequest} */req) => req.session?.user == null ? 'none' : req.session.user.id);

export const httpLogger = morgan(':date[iso] :paddedMethod :url (user :userId) :req[content-type] ==> (code :status) (time :response-time ms) (len :res[content-length])');

export const logger = winston.createLogger(({
	level: 'info',
	format: winston.format.combine(
		format.timestamp(),
		format.colorize({ level: true }),
		format.padLevels(),
		format.splat(),
		format.printf(info => `${info.timestamp} [${info.level}] ${info.message}`),
	),
	transports: [
		new winston.transports.Console(),
	],
}));
