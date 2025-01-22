import type { ParameterizedContext } from 'koa';
import { Types } from 'mongoose';
import { z } from 'zod';

import type { AuthenticatedState } from '../../middleware/authMiddleware';
import { MeetingModel } from '../MeetingModel';

interface MeetingTranscriptPutParams {
  id: string;
}

const bodySchema = z.object({
  transcript: z.string().min(1, 'Transcript must not be empty'),
  duration: z.number().min(1, 'Duration must be greater than or equal to 1'),
});

export const meetingTranscriptPut = async (
  ctx: ParameterizedContext<AuthenticatedState>,
) => {
  const { id } = ctx.params as MeetingTranscriptPutParams;

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

  const result = bodySchema.safeParse(ctx.request.body);

  if (!result.success) {
    ctx.status = 400;
    ctx.body = {
      message: 'Invalid body',
      errors: result.error.flatten(),
    };

    return;
  }

  const { transcript, duration } = result.data;

  await MeetingModel.updateOne(
    {
      _id: meeting._id,
    },
    {
      $set: {
        transcript,
        duration,
      },
    },
  );

  ctx.body = {
    message: 'Transcript updated successfully',
  };
};
