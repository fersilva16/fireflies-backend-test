import request from 'supertest';
import { expect, it } from 'vitest';

import { app } from '../../../app';
import { MeetingModel } from '../../MeetingModel';

it('should create a meeting', async () => {
  const userId = 'user1';

  const response = await request(app.callback())
    .post(`/api/meetings`)
    .set('x-user-id', userId)
    .set('content-type', 'application/json')
    .send({
      title: 'Meeting Title',
      date: '2025-01-22T17:27:56.721Z',
      participants: ['John Doe', 'Alice Brown'],
    });

  expect(response.status).toBe(200);

  const meetings = await MeetingModel.find();

  expect(meetings).toHaveLength(1);

  const [meeting] = meetings;

  expect(meeting?.title).toBe(response.body.title);
  expect(meeting?.date.toISOString()).toBe(response.body.date);
  expect(meeting?.participants).toHaveLength(2);
  expect(meeting?.participants).toContain(response.body.participants[0]);
  expect(meeting?.participants).toContain(response.body.participants[1]);

  expect(meeting?.actionItems).toHaveLength(0);
  expect(meeting?.transcript).toBeUndefined();
  expect(meeting?.duration).toBeUndefined();
  expect(meeting?.summary).toBeUndefined();
});

it('should not create a meeting if user is not authenticated', async () => {
  const response = await request(app.callback()).post('/api/meetings');

  expect(response.status).toBe(401);
  expect(response.body.message).toBe('Authentication required');
});

it('should not create a meeting with invalid title', async () => {
  const userId = 'user1';

  const response = await request(app.callback())
    .post(`/api/meetings`)
    .set('x-user-id', userId)
    .set('content-type', 'application/json')
    .send({
      title: '',
      date: '2025-01-22T17:27:56.721Z',
      participants: ['John Doe', 'Alice Brown'],
    });

  expect(response.status).toBe(400);

  expect(response.body.message).toBe('Invalid body');
  expect(response.body.errors).toEqual({
    fieldErrors: {
      title: ['Title must not be empty'],
    },
    formErrors: [],
  });
});

it('should not create a meeting with invalid date', async () => {
  const userId = 'user1';

  const response = await request(app.callback())
    .post(`/api/meetings`)
    .set('x-user-id', userId)
    .set('content-type', 'application/json')
    .send({
      title: 'Meeting Title',
      date: '2025-01-22',
      participants: ['John Doe', 'Alice Brown'],
    });

  expect(response.status).toBe(400);

  expect(response.body.message).toBe('Invalid body');
  expect(response.body.errors).toEqual({
    fieldErrors: {
      date: ['Invalid date format. Use ISO 8601'],
    },
    formErrors: [],
  });
});

it('should not create a meeting with invalid participants', async () => {
  const userId = 'user1';

  const response = await request(app.callback())
    .post(`/api/meetings`)
    .set('x-user-id', userId)
    .set('content-type', 'application/json')
    .send({
      title: 'Meeting Title',
      date: '2025-01-22T17:27:56.721Z',
      participants: ['John Doe', 'Alice Brown', ''],
    });

  expect(response.status).toBe(400);

  expect(response.body.message).toBe('Invalid body');
  expect(response.body.errors).toEqual({
    fieldErrors: {
      participants: ['Participant name must not be empty'],
    },
    formErrors: [],
  });
});

it('should not create a meeting with no participants', async () => {
  const userId = 'user1';

  const response = await request(app.callback())
    .post(`/api/meetings`)
    .set('x-user-id', userId)
    .set('content-type', 'application/json')
    .send({
      title: 'Meeting Title',
      date: '2025-01-22T17:27:56.721Z',
      participants: [],
    });

  expect(response.status).toBe(400);

  expect(response.body.message).toBe('Invalid body');
  expect(response.body.errors).toEqual({
    fieldErrors: {
      participants: ['At least one participant is required'],
    },
    formErrors: [],
  });
});
