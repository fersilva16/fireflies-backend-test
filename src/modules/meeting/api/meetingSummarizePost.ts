import type { ParameterizedContext } from 'koa';
import { Types } from 'mongoose';

import type { AuthenticatedState } from '../../../middleware/authMiddleware';
import { summaryProviderGet } from '../../summaryProvider/summaryProviderRegister';
import { TaskModel } from '../../task/TaskModel';
import { TASK_STATUS_ENUM } from '../../task/TaskStatusEnum';
import { MeetingModel } from '../MeetingModel';

interface MeetingSummarizePostParams {
  id: string;
}

export const meetingSummarizePost = async (
  ctx: ParameterizedContext<AuthenticatedState>,
) => {
  const { id } = ctx.params as MeetingSummarizePostParams;

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

  const provider = summaryProviderGet();

  const result = await provider.summarize({ transcript: meeting.transcript });

  if (!result.success) {
    ctx.status = 500;
    ctx.body = {
      message: 'Summarization failed',
    };

    return;
  }

  await MeetingModel.updateOne(
    {
      _id: meeting._id,
    },
    {
      $set: {
        summary: result.summary,
        actionItems: result.actionItems,
      },
    },
  );

  // TODO: Should tasks be created from action items? What's the due date, status and description?
  const taskPayloads = result.actionItems.map((actionItem) => ({
    meetingId: meeting._id,
    userId: meeting.userId,
    title: actionItem,
    description: '',
    status: TASK_STATUS_ENUM.PENDING,
    dueDate: new Date(),
  }));

  await TaskModel.insertMany(taskPayloads);

  ctx.body = {
    message: 'Summarization successful',
  };
};
