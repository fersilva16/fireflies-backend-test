import type { ParameterizedContext } from 'koa';

import type { AuthenticatedState } from '../../middleware/authMiddleware';
import { MeetingModel } from '../MeetingModel';

interface MeetingGetParams {
  id: string;
}

export const meetingGet = async (
  ctx: ParameterizedContext<AuthenticatedState>,
) => {
  const { id } = ctx.params as MeetingGetParams;

  const meeting = await MeetingModel.findOne({
    _id: id,
    userId: ctx.state.userId,
  });

  if (!meeting) {
    ctx.status = 404;
    ctx.body = {
      message: 'Meeting not found',
    };

    return;
  }

  ctx.body = meeting;
};
