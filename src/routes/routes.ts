import Router from '@koa/router';

import { apiRoutes } from './apiRoutes';
import { errorMiddleware } from '../middleware/errorHandler';

const routes = new Router();

routes.use(errorMiddleware);

routes.get('/', (ctx) => {
  ctx.body = {
    message: 'Welcome to the MeetingBot API',
  };
});

routes.use('/api', apiRoutes.routes(), apiRoutes.allowedMethods());

export { routes };
