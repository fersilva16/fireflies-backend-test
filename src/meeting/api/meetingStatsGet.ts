import type { ParameterizedContext } from 'koa';

import type { AuthenticatedState } from '../../middleware/authMiddleware';

export const meetingStatsGet = (
  ctx: ParameterizedContext<AuthenticatedState>,
) => {
  // TODO: get statistics from the database
  const stats = {
    generalStats: {
      totalMeetings: 100,
      averageParticipants: 4.75,
      totalParticipants: 475,
      shortestMeeting: 15,
      longestMeeting: 120,
      averageDuration: 45.3,
    },
    topParticipants: [
      { participant: 'John Doe', meetingCount: 20 },
      { participant: 'Jane Smith', meetingCount: 18 },
      { participant: 'Bob Johnson', meetingCount: 15 },
      { participant: 'Alice Brown', meetingCount: 12 },
      { participant: 'Charlie Davis', meetingCount: 10 },
    ],
    meetingsByDayOfWeek: [
      { dayOfWeek: 1, count: 10 },
      { dayOfWeek: 2, count: 22 },
      { dayOfWeek: 3, count: 25 },
      { dayOfWeek: 4, count: 20 },
      { dayOfWeek: 5, count: 18 },
      { dayOfWeek: 6, count: 5 },
      { dayOfWeek: 7, count: 0 },
    ],
  };

  ctx.body = stats;
};
