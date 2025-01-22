import type { ParameterizedContext } from 'koa';
import { z } from 'zod';

import type { AuthenticatedState } from '../../middleware/authMiddleware';
import { mongoosePaginate } from '../../mongoose/mongoosePaginate';
import { MeetingModel } from '../MeetingModel';

const querySchema = z.object({
  page: z.coerce
    .number()
    .min(1, 'Page must be greater than or equal to 1')
    .default(1),
  limit: z.coerce
    .number()
    .min(1, 'Limit must be greater than or equal to 1')
    .max(100, 'Limit must be less than or equal to 100')
    .default(100),
});

export const meetingAllGet = async (
  ctx: ParameterizedContext<AuthenticatedState>,
) => {
  const result = querySchema.safeParse(ctx.query);

  if (!result.success) {
    ctx.status = 400;
    ctx.body = {
      message: 'Invalid query parameters',
      errors: result.error.flatten(),
    };

    return;
  }

  const { page, limit } = result.data;

  const slice = await mongoosePaginate({
    model: MeetingModel,
    page,
    limit,
    filters: {
      userId: ctx.state.userId,
    },
  });

  ctx.body = slice;
};
