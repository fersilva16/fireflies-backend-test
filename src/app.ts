import { bodyParser } from '@koa/bodyparser';
import Koa from 'koa';

import { routes } from './routes/routes';

const app = new Koa();

app.use(bodyParser());

app.use(routes.routes());
app.use(routes.allowedMethods());

export { app };
