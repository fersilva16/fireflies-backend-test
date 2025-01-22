import { bodyParser } from '@koa/bodyparser';
import Koa from 'koa';

import { config } from './config.js';
import { logger } from './logger.js';
import { mongooseConnect } from './mongoose/mongooseConnect.js';
import { routes } from './routes/routes.js';

const app = new Koa();

await mongooseConnect();

app.use(bodyParser());

app.use(routes.routes());
app.use(routes.allowedMethods());

app.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`);
});
