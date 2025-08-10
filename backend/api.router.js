import { Router } from 'express';

import seedDataController from './controllers/seedData.controller.js';

const apiRouter = Router();

/* GET users listing. */
apiRouter.get('/users', (_req, res) => {
	res.jsonData('respond with a resource');
});

apiRouter.get('/seed-mongodb-data', seedDataController.start);

export default apiRouter;
