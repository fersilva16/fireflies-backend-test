import { type Response } from 'express';

import { type AuthenticatedRequest } from '../../auth.middleware';
import { MeetingModel } from '../MeetingModel';

export const meetingAllGet = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const meetings = await MeetingModel.find();

  res.json({
    total: meetings.length,
    limit: req.query.limit,
    page: req.query.page,
    data: meetings,
  });
};
