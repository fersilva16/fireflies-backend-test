import type { ParameterizedContext } from 'koa';

import type { AuthenticatedState } from '../../../middleware/authMiddleware';
import { MeetingModel } from '../MeetingModel';

interface GeneralStats {
  totalMeetings: number;
  averageParticipants: number;
  totalParticipants: number;
  shortestMeeting: number;
  longestMeeting: number;
  averageDuration: number;
}

interface TopParticipant {
  participant: string;
  meetingCount: number;
}

interface MeetingsByDayOfWeek {
  _id: number;
  count: number;
}

export const meetingStatsGet = async (
  ctx: ParameterizedContext<AuthenticatedState>,
) => {
  const [generalStats] = await MeetingModel.aggregate<GeneralStats>([
    {
      $match: {
        userId: ctx.state.userId,
      },
    },
    {
      $group: {
        _id: null,
        totalMeetings: { $sum: 1 },
        averageParticipants: { $avg: { $size: '$participants' } },
        totalParticipants: { $sum: { $size: '$participants' } },
        shortestMeeting: { $min: '$duration' },
        longestMeeting: { $max: '$duration' },
        averageDuration: { $avg: '$duration' },
      },
    },
    {
      $project: {
        _id: 0,
        totalMeetings: 1,
        averageParticipants: { $round: ['$averageParticipants', 2] },
        totalParticipants: 1,
        shortestMeeting: 1,
        longestMeeting: 1,
        averageDuration: { $round: ['$averageDuration', 2] },
      },
    },
  ]);

  const topParticipants = await MeetingModel.aggregate<TopParticipant>([
    {
      $match: {
        userId: ctx.state.userId,
      },
    },
    {
      $unwind: {
        path: '$participants',
      },
    },
    {
      $group: {
        _id: '$participants',
        meetingCount: { $sum: 1 },
      },
    },
    {
      $limit: 5,
    },
    {
      $sort: {
        meetingCount: -1,
        _id: 1,
      },
    },
    {
      $project: {
        _id: 0,
        participant: '$_id',
        meetingCount: 1,
      },
    },
  ]);

  const countByDayOfWeek = await MeetingModel.aggregate<MeetingsByDayOfWeek>([
    {
      $match: {
        userId: ctx.state.userId,
      },
    },
    {
      $group: {
        _id: {
          $dayOfWeek: '$date',
        },
        count: { $sum: 1 },
      },
    },
  ]);

  // Normalize the day of weeks to have all days
  const meetingsByDayOfWeek = Array.from({ length: 7 }, (_, i) => {
    const dayOfWeek = i + 1;

    const count = countByDayOfWeek.find(
      (item) => item._id === dayOfWeek,
    )?.count;

    return {
      dayOfWeek,
      count: count ?? 0,
    };
  });

  ctx.body = {
    generalStats: {
      totalMeetings: generalStats?.totalMeetings ?? 0,
      averageParticipants: generalStats?.averageParticipants ?? 0,
      totalParticipants: generalStats?.totalParticipants ?? 0,
      shortestMeeting: generalStats?.shortestMeeting ?? 0,
      longestMeeting: generalStats?.longestMeeting ?? 0,
      averageDuration: generalStats?.averageDuration ?? 0,
    },
    topParticipants,
    meetingsByDayOfWeek,
  };
};
