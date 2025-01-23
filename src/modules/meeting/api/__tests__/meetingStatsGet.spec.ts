import request from 'supertest';
import { expect, it } from 'vitest';

import { app } from '../../../../app';
import { meetingFixture } from '../../meetingFixture';

it('should return statistics for meetings', async () => {
  const userId = 'user1';

  await meetingFixture({
    userId,
    date: new Date('2025-01-01T12:00:00.000Z'),
    duration: 123,
    participants: ['John Doe'],
  });

  await meetingFixture({
    userId,
    date: new Date('2025-01-02T12:00:00.000Z'),
    duration: 172,
    participants: ['John Doe', 'Alice Brown'],
  });

  await meetingFixture({
    userId,
    date: new Date('2025-01-05T12:00:00.000Z'),
    duration: 12,
    participants: ['John Doe', 'Lorem Ipsum'],
  });

  const response = await request(app.callback())
    .get('/api/meetings/stats')
    .set('x-user-id', userId);

  expect(response.status).toBe(200);

  expect(response.body).toEqual({
    generalStats: {
      averageDuration: 102.33,
      averageParticipants: 1.67,
      longestMeeting: 172,
      shortestMeeting: 12,
      totalMeetings: 3,
      totalParticipants: 5,
    },
    topParticipants: [
      { participant: 'John Doe', meetingCount: 3 },
      { participant: 'Alice Brown', meetingCount: 1 },
      { participant: 'Lorem Ipsum', meetingCount: 1 },
    ],
    meetingsByDayOfWeek: [
      { dayOfWeek: 1, count: 1 },
      { dayOfWeek: 2, count: 0 },
      { dayOfWeek: 3, count: 0 },
      { dayOfWeek: 4, count: 1 },
      { dayOfWeek: 5, count: 1 },
      { dayOfWeek: 6, count: 0 },
      { dayOfWeek: 7, count: 0 },
    ],
  });
});

it('should not return statistics for meetings if user is not authenticated', async () => {
  const response = await request(app.callback()).get('/api/meetings/stats');

  expect(response.status).toBe(401);
  expect(response.body.message).toBe('Authentication required');
});

it('should not return statistics for meetings from other user', async () => {
  const userId = 'user1';

  await meetingFixture({
    userId,
    date: new Date('2025-01-01T12:00:00.000Z'),
    duration: 123,
    participants: ['John Doe'],
  });

  await meetingFixture({
    userId,
    date: new Date('2025-01-02T12:00:00.000Z'),
    duration: 172,
    participants: ['John Doe', 'Alice Brown'],
  });

  await meetingFixture({
    userId,
    date: new Date('2025-01-05T12:00:00.000Z'),
    duration: 12,
    participants: ['John Doe', 'Lorem Ipsum'],
  });

  await meetingFixture({
    userId: 'user2',
    date: new Date('2025-01-01T12:00:00.000Z'),
    duration: 123,
    participants: ['John Doe'],
  });

  const response = await request(app.callback())
    .get('/api/meetings/stats')
    .set('x-user-id', userId);

  expect(response.status).toBe(200);

  expect(response.body).toEqual({
    generalStats: {
      averageDuration: 102.33,
      averageParticipants: 1.67,
      longestMeeting: 172,
      shortestMeeting: 12,
      totalMeetings: 3,
      totalParticipants: 5,
    },
    topParticipants: [
      { participant: 'John Doe', meetingCount: 3 },
      { participant: 'Alice Brown', meetingCount: 1 },
      { participant: 'Lorem Ipsum', meetingCount: 1 },
    ],
    meetingsByDayOfWeek: [
      { dayOfWeek: 1, count: 1 },
      { dayOfWeek: 2, count: 0 },
      { dayOfWeek: 3, count: 0 },
      { dayOfWeek: 4, count: 1 },
      { dayOfWeek: 5, count: 1 },
      { dayOfWeek: 6, count: 0 },
      { dayOfWeek: 7, count: 0 },
    ],
  });
});

it('should return empty statistics if there are no meetings', async () => {
  const userId = 'user1';

  const response = await request(app.callback())
    .get('/api/meetings/stats')
    .set('x-user-id', userId);

  expect(response.status).toBe(200);

  expect(response.body).toEqual({
    generalStats: {
      averageDuration: 0,
      averageParticipants: 0,
      longestMeeting: 0,
      shortestMeeting: 0,
      totalMeetings: 0,
      totalParticipants: 0,
    },
    topParticipants: [],
    meetingsByDayOfWeek: [
      { dayOfWeek: 1, count: 0 },
      { dayOfWeek: 2, count: 0 },
      { dayOfWeek: 3, count: 0 },
      { dayOfWeek: 4, count: 0 },
      { dayOfWeek: 5, count: 0 },
      { dayOfWeek: 6, count: 0 },
      { dayOfWeek: 7, count: 0 },
    ],
  });
});
