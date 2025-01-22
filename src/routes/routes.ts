import Router from '@koa/router';

import { apiRoutes } from './apiRoutes';

const routes = new Router();

routes.get('/', (ctx) => {
  ctx.body = {
    message: 'Welcome to the MeetingBot API',
  };
});

routes.use('/api', apiRoutes.routes(), apiRoutes.allowedMethods());

export { routes };
