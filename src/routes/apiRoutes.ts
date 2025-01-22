import Router from '@koa/router';

import { dashboardRoutes } from '../dashboard/dashboardRoutes';
import { meetingRoutes } from '../meeting/meetingRoutes';
import { authMiddleware } from '../middleware/authMiddleware';

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
