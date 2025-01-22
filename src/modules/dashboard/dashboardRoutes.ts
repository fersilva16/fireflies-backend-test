import Router from '@koa/router';

import { dashboardGet } from './api/dashboardGet';

const dashboardRoutes = new Router();

dashboardRoutes.get('/', dashboardGet);

export { dashboardRoutes };
