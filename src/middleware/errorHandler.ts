import type { Next, ParameterizedContext } from 'koa';

import { logger } from '../logger';

export const errorMiddleware = async (
  ctx: ParameterizedContext,
  next: Next,
) => {
  try {
    await next();
  } catch (err) {
    logger.error(err, 'API Error');

    ctx.status = 500;
    ctx.body = {
      message: 'Internal Server Error',
    };
  }
};
