import type { ParameterizedContext } from 'koa';

import type { AuthenticatedState } from '../../middleware/authMiddleware';
import { mongoosePaginate } from '../../mongoose/mongoosePaginate';
import { MeetingModel } from '../MeetingModel';

export const meetingAllGet = async (
  ctx: ParameterizedContext<AuthenticatedState>,
) => {
  const slice = await mongoosePaginate({
    model: MeetingModel,
    // TODO: validate query params
    page: Number(ctx.query.page),
    limit: Number(ctx.query.limit),
  });

  ctx.body = slice;
};
