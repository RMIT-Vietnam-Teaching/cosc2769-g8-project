import path from 'node:path';
import { env } from 'node:process';

import MongoStore from 'connect-mongo';
import { millisecondsInDay } from 'date-fns/constants';
import Express from 'express';
import session from 'express-session';
import { connect } from 'mongoose';

import apiRouter from './api.router.js';
import { httpLogger } from './logger.js';
import middleware from './middleware.js';

connect(process.env.DATABASE_URL);

const app = Express();

app.set('env', process.env.NODE_ENV);

app.use('/api', httpLogger);

if (env.NODE_ENV === 'production') {
	app.use(Express.static('dist', {
		dotfiles: 'ignore',
		extensions: ['js', 'css', 'html', 'png', 'jpg', 'jpeg', 'svg'],
		index: false,
		redirect: false,
		fallthrough: true,
	}));
}

app.use(Express.static('public', {
	dotfiles: 'ignore',
	extensions: ['js', 'css', 'png', 'jpg', 'jpeg', 'svg'],
	index: false,
	redirect: false,
	fallthrough: true,
}));

// Only used sub path of /api so that react-router can handle the rest
app.use('/api', Express.json());
app.use('/api', Express.urlencoded({ extended: true }));

app.use('/api', session({
	secret: process.env.SESSION_SECRET_KEY,
	resave: false,
	saveUninitialized: false,
	store: MongoStore.create({
		mongoUrl: process.env.DATABASE_URL,
		collectionName: 'login_sessions',
		autoRemove: 'native',
		stringify: false,
	}),
	cookie: {
		maxAge: 14 * millisecondsInDay,
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		sameSite: 'lax',
	},
}));

app.use('/api', middleware.jsonResponseHelper);
app.use('/api', apiRouter);
app.use('/api', middleware.notFound);
app.use('/api', middleware.error);

// Only letting react router handle GET requests
app.use('/', middleware.onlyGetRequest);

if (process.env.NODE_ENV === 'production') {
	app.get('*', (_, res) => res.sendFile(path.join(process.cwd(), 'dist', 'index.html')));
}

export default app;
