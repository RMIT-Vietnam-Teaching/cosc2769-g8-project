import Express from 'express';
import logger from 'morgan';

import apiRouter from './api.router.js';
import middleware from './middleware.js';

const app = Express();

app.use(logger('dev'));

app.use(Express.static('public', {
	dotfiles: 'ignore',
	extensions: ['js', 'css', 'png', 'jpg', 'jpeg', 'svg'],
	index: false,
	redirect: false,
	fallthrough: true,
}));

app.use('/api', middleware.jsonResponseHelper);

// Only used sub path of /api so that react-router can handle the rest
app.use('/api', Express.json());
app.use('/api', Express.urlencoded({ extended: true }));
app.use('/api', middleware.jsonResponseHelper);
app.use('/api', apiRouter);
app.use('/api', middleware.notFound);
app.use('/api', middleware.error);

// Only letting react router handle GET requests
app.use('/', middleware.onlyGetRequest);

export default app;
