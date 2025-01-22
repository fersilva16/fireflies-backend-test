import Router from '@koa/router';

import { dashboardGet } from './api/dashboardGet.js';

const dashboardRoutes = new Router();

dashboardRoutes.get('/', dashboardGet);

export { dashboardRoutes };
