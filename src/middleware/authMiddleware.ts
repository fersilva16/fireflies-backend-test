import type { Next, ParameterizedContext } from 'koa';

export interface AuthenticatedState {
  userId: string;
}

export const authMiddleware = (ctx: ParameterizedContext, next: Next) => {
  const userId = ctx.headers['x-user-id'];

  if (!userId) {
    ctx.stauts = 401;
    ctx.body = {
      message: 'Authentication required',
    };

    return;
  }

  ctx.state.userId = userId;

  return next();
};
