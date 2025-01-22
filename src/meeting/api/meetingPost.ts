import type { ParameterizedContext } from 'koa';
import { z } from 'zod';

import type { AuthenticatedState } from '../../middleware/authMiddleware';
import { MeetingModel } from '../MeetingModel';

const bodySchema = z.object({
  title: z.string().min(1, 'Title must not be empty'),
  date: z.string().datetime({ message: 'Invalid date format. Use ISO 8601' }),
  participants: z.array(
    z.string().min(1, 'Participant name must not be empty'),
  ),
});

export const meetingPost = async (
  ctx: ParameterizedContext<AuthenticatedState>,
) => {
  const result = bodySchema.safeParse(ctx.request.body);

  if (!result.success) {
    ctx.status = 400;
    ctx.body = {
      message: 'Invalid body',
      errors: result.error.flatten(),
    };

    return;
  }

  const { title, date, participants } = result.data;

  const meeting = await new MeetingModel({
    userId: ctx.state.userId,
    title,
    date,
    participants,
  }).save();

  ctx.body = meeting.toJSON();
};
