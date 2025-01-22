import { Response } from 'express';
import { AuthenticatedRequest } from '../../auth.middleware';
import { MeetingModel } from '../MeetingModel';

export const meetingAllGet = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const meetings = await MeetingModel.find();

    res.json({
      total: meetings.length,
      limit: req.query.limit,
      page: req.query.page,
      data: meetings,
    });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
