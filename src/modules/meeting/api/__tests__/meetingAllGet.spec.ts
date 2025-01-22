import request from 'supertest';
import { expect, it } from 'vitest';

import { app } from '../../../../app';
import { meetingFixture } from '../../meetingFixture';

it('should return all meetings', async () => {
  const userId = 'user1';

  const meeting1 = await meetingFixture({
    userId,
  });

  const meeting2 = await meetingFixture({
    userId,
  });

  const response = await request(app.callback())
    .get('/api/meetings')
    .set('x-user-id', userId);

  expect(response.status).toBe(200);

  expect(response.body.total).toBe(2);
  expect(response.body.limit).toBe(100);
  expect(response.body.page).toBe(1);
  expect(response.body.count).toBe(2);
  expect(response.body.hasNextPage).toBe(false);

  expect(response.body.data).toHaveLength(2);

  expect(response.body.data[0]._id).toBe(meeting1._id.toString());
  expect(response.body.data[0].title).toBe(meeting1.title);
  expect(response.body.data[0].date).toBe(meeting1.date.toISOString());
  expect(response.body.data[0].participants).toEqual(meeting1.participants);
  expect(response.body.data[0].transcript).toBe(meeting1.transcript);
  expect(response.body.data[0].summary).toBe(meeting1.summary);
  expect(response.body.data[0].duration).toBe(meeting1.duration);
  expect(response.body.data[0].actionItems).toEqual(meeting1.actionItems);

  expect(response.body.data[1]._id).toBe(meeting2._id.toString());
  expect(response.body.data[1].title).toBe(meeting2.title);
  expect(response.body.data[1].date).toBe(meeting2.date.toISOString());
  expect(response.body.data[1].participants).toEqual(meeting2.participants);
  expect(response.body.data[1].transcript).toBe(meeting2.transcript);
  expect(response.body.data[1].summary).toBe(meeting2.summary);
  expect(response.body.data[1].duration).toBe(meeting2.duration);
  expect(response.body.data[1].actionItems).toEqual(meeting2.actionItems);
});

it('should return the first 2 meetings', async () => {
  const userId = 'user1';

  const meeting1 = await meetingFixture({
    userId,
  });

  const meeting2 = await meetingFixture({
    userId,
  });

  await meetingFixture({
    userId,
  });

  const response = await request(app.callback())
    .get('/api/meetings')
    .set('x-user-id', userId)
    .query({
      page: 1,
      limit: 2,
    });

  expect(response.status).toBe(200);

  expect(response.body.total).toBe(3);
  expect(response.body.limit).toBe(2);
  expect(response.body.page).toBe(1);
  expect(response.body.count).toBe(2);
  expect(response.body.hasNextPage).toBe(true);

  expect(response.body.data).toHaveLength(2);
  expect(response.body.data[0]._id).toBe(meeting1._id.toString());
  expect(response.body.data[1]._id).toBe(meeting2._id.toString());
});

it('should return the second page of meetings', async () => {
  const userId = 'user1';

  await meetingFixture({
    userId,
  });

  await meetingFixture({
    userId,
  });

  const meeting3 = await meetingFixture({
    userId,
  });

  const response = await request(app.callback())
    .get('/api/meetings')
    .set('x-user-id', userId)
    .query({
      page: 2,
      limit: 2,
    });

  expect(response.status).toBe(200);

  expect(response.body.total).toBe(3);
  expect(response.body.limit).toBe(2);
  expect(response.body.page).toBe(2);
  expect(response.body.count).toBe(1);
  expect(response.body.hasNextPage).toBe(false);

  expect(response.body.data).toHaveLength(1);
  expect(response.body.data[0]._id).toBe(meeting3._id.toString());
});

it('should not return meetings if user is not authenticated', async () => {
  const response = await request(app.callback()).get('/api/meetings');

  expect(response.status).toBe(401);
  expect(response.body.message).toBe('Authentication required');
});

it('should not return meetings with invalid page', async () => {
  const userId = 'user1';

  await meetingFixture({
    userId,
  });

  const response = await request(app.callback())
    .get('/api/meetings')
    .set('x-user-id', userId)
    .query({
      page: -1,
      limit: 2,
    });

  expect(response.status).toBe(400);

  expect(response.body.message).toBe('Invalid query parameters');
  expect(response.body.errors).toEqual({
    fieldErrors: {
      page: ['Page must be greater than or equal to 1'],
    },
    formErrors: [],
  });
});

it('should not return meetings with invalid limit', async () => {
  const userId = 'user1';

  await meetingFixture({
    userId,
  });

  const response = await request(app.callback())
    .get('/api/meetings')
    .set('x-user-id', userId)
    .query({
      page: 1,
      limit: -1,
    });

  expect(response.status).toBe(400);

  expect(response.body.message).toBe('Invalid query parameters');
  expect(response.body.errors).toEqual({
    fieldErrors: {
      limit: ['Limit must be greater than or equal to 1'],
    },
    formErrors: [],
  });
});

it('should not return meetings from other users', async () => {
  const userId = 'user1';

  await meetingFixture({
    userId: 'user2',
  });

  const response = await request(app.callback())
    .get('/api/meetings')
    .set('x-user-id', userId);

  expect(response.status).toBe(200);

  expect(response.body.total).toBe(0);
  expect(response.body.limit).toBe(100);
  expect(response.body.page).toBe(1);
  expect(response.body.count).toBe(0);
  expect(response.body.hasNextPage).toBe(false);

  expect(response.body.data).toHaveLength(0);
});
