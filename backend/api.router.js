import { Router } from 'express';

const apiRouter = Router();

/* GET users listing. */
apiRouter.get('/users', (_req, res) => {
	res.jsonData('respond with a resource');
});

export default apiRouter;
