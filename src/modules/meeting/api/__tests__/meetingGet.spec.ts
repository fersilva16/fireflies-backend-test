import request from 'supertest';
import { expect, it } from 'vitest';

import { app } from '../../../../app';
import { taskFixture } from '../../../task/taskFixture';
import { meetingFixture } from '../../meetingFixture';

it('should return the meeting', async () => {
  const userId = 'user1';

  const meeting = await meetingFixture({
    userId,
  });

  const task = await taskFixture({
    userId,
    meetingId: meeting._id,
  });

  const response = await request(app.callback())
    .get(`/api/meetings/${meeting._id.toString()}`)
    .set('x-user-id', userId);

  expect(response.status).toBe(200);

  expect(response.body._id.toString()).toBe(meeting._id.toString());
  expect(response.body.title).toBe(meeting.title);
  expect(response.body.date).toBe(meeting.date.toISOString());
  expect(response.body.participants).toEqual(meeting.participants);
  expect(response.body.transcript).toBe(meeting.transcript);
  expect(response.body.summary).toBe(meeting.summary);
  expect(response.body.duration).toBe(meeting.duration);
  expect(response.body.actionItems).toEqual(meeting.actionItems);

  expect(response.body.tasks).toHaveLength(1);
  expect(response.body.tasks[0]._id.toString()).toBe(task._id.toString());
});

it('should not return meetings if user is not authenticated', async () => {
  const meeting = await meetingFixture({
    userId: 'user1',
  });

  const response = await request(app.callback()).get(
    `/api/meetings/${meeting._id.toString()}`,
  );

  expect(response.status).toBe(401);
  expect(response.body.message).toBe('Authentication required');
});

it('should not return a meeting from other user', async () => {
  const userId = 'user1';

  const meeting = await meetingFixture({
    userId: 'user2',
  });

  const response = await request(app.callback())
    .get(`/api/meetings/${meeting._id.toString()}`)
    .set('x-user-id', userId);

  expect(response.status).toBe(404);
  expect(response.body.message).toBe('Meeting not found');
});

it('should not return meeting if meeting id is invalid', async () => {
  const userId = 'user1';

  const response = await request(app.callback())
    .get(`/api/meetings/invalid_id`)
    .set('x-user-id', userId);

  expect(response.status).toBe(400);
  expect(response.body.message).toBe('Invalid Id');
});
