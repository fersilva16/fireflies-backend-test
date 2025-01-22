import type { ParameterizedContext } from 'koa';
import { Types } from 'mongoose';

import type { AuthenticatedState } from '../../../middleware/authMiddleware';
import { TaskModel } from '../../task/TaskModel';
import { MeetingModel } from '../MeetingModel';

interface MeetingGetParams {
  id: string;
}

export const meetingGet = async (
  ctx: ParameterizedContext<AuthenticatedState>,
) => {
  const { id } = ctx.params as MeetingGetParams;

  if (!Types.ObjectId.isValid(id)) {
    ctx.status = 400;
    ctx.body = {
      message: 'Invalid Id',
    };

    return;
  }

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

  const tasks = await TaskModel.find({
    userId: ctx.state.userId,
    meetingId: meeting._id,
  });

  ctx.body = {
    ...meeting.toJSON(),
    tasks,
  };
};
