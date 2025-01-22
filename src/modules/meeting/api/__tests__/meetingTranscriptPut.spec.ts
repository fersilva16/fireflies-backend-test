import mongoose from 'mongoose';
import request from 'supertest';
import { expect, it } from 'vitest';

import { app } from '../../../../app';
import { MeetingModel } from '../../MeetingModel';
import { meetingFixture } from '../../meetingFixture';

it('should update the transcript for a meeting', async () => {
  const userId = 'user1';

  const meeting = await meetingFixture({
    userId,
  });

  const response = await request(app.callback())
    .put(`/api/meetings/${meeting._id.toString()}/transcript`)
    .set('x-user-id', userId)
    .set('content-type', 'application/json')
    .send({
      transcript: 'This is the new transcript',
      duration: 183,
    });

  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Transcript updated successfully');

  const meetings = await MeetingModel.find();

  expect(meetings).toHaveLength(1);

  const [meetingUpdated] = meetings;

  expect(meetingUpdated?._id.toString()).toBe(meeting._id.toString());
  expect(meetingUpdated?.transcript).toBe('This is the new transcript');
  expect(meetingUpdated?.duration).toBe(183);
});

it('should not update the transcript for a meeting if user is not authenticated', async () => {
  const meeting = await meetingFixture({
    userId: 'user1',
  });

  const response = await request(app.callback()).put(
    `/api/meetings/${meeting._id.toString()}/transcript`,
  );

  expect(response.status).toBe(401);
  expect(response.body.message).toBe('Authentication required');
});

it('should not update the transcript for a meeting if meeting does not exist', async () => {
  const userId = 'user1';

  const id = new mongoose.Types.ObjectId();

  const response = await request(app.callback())
    .put(`/api/meetings/${id.toString()}/transcript`)
    .set('x-user-id', userId)
    .set('content-type', 'application/json')
    .send({
      transcript: 'This is the new transcript',
      duration: 183,
    });

  expect(response.status).toBe(404);
  expect(response.body.message).toBe('Meeting not found');
});

it('should not update the transcript for a meeting from other user', async () => {
  const userId = 'user1';

  const meeting = await meetingFixture({
    userId: 'user2',
  });

  const response = await request(app.callback())
    .put(`/api/meetings/${meeting._id.toString()}/transcript`)
    .set('x-user-id', userId)
    .set('content-type', 'application/json')
    .send({
      transcript: 'This is the new transcript',
      duration: 183,
    });

  expect(response.status).toBe(404);
  expect(response.body.message).toBe('Meeting not found');
});

it('should not update the transcript for a meeting with invalid transcript', async () => {
  const userId = 'user1';

  const meeting = await meetingFixture({
    userId,
  });

  const response = await request(app.callback())
    .put(`/api/meetings/${meeting._id.toString()}/transcript`)
    .set('x-user-id', userId)
    .set('content-type', 'application/json')
    .send({
      transcript: '',
      duration: 183,
    });

  expect(response.status).toBe(400);

  expect(response.body.message).toBe('Invalid body');
  expect(response.body.errors).toEqual({
    fieldErrors: {
      transcript: ['Transcript must not be empty'],
    },
    formErrors: [],
  });
});

it('should not update the transcript for a meeting if meeting id is invalid', async () => {
  const userId = 'user1';

  const response = await request(app.callback())
    .put(`/api/meetings/invalid_id/transcript`)
    .set('x-user-id', userId)
    .set('content-type', 'application/json')
    .send({
      transcript: 'This is the new transcript',
      duration: 183,
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe('Invalid Id');
});
