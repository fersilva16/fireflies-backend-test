import { type Response } from 'express';

import { type AuthenticatedRequest } from '../../auth.middleware';
import { mongoosePaginate } from '../../mongoose/mongoosePaginate';
import { MeetingModel } from '../MeetingModel';

export const meetingAllGet = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const slice = await mongoosePaginate({
    model: MeetingModel,
    // TODO: validate query params
    page: Number(req.query.page),
    limit: Number(req.query.limit),
  });

  res.json(slice);
};
