import Router from '@koa/router';

import { authMiddleware } from '../middleware/authMiddleware';
import { dashboardRoutes } from '../modules/dashboard/dashboardRoutes';
import { meetingRoutes } from '../modules/meeting/meetingRoutes';

const apiRoutes = new Router();

apiRoutes.use(authMiddleware);

apiRoutes.use(
  '/meetings',
  meetingRoutes.routes(),
  meetingRoutes.allowedMethods(),
);

apiRoutes.use(
  '/dashboard',
  dashboardRoutes.routes(),
  dashboardRoutes.allowedMethods(),
);

export { apiRoutes };
