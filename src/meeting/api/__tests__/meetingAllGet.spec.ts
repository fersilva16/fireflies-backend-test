import request from 'supertest';
import { expect, it } from 'vitest';

import { app } from '../../../app';
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
    .set('x-user-id', 'user1');

  expect(response.status).toBe(200);

  expect(response.body.total).toBe(2);
  expect(response.body.limit).toBe(100);
  expect(response.body.page).toBe(1);
  expect(response.body.count).toBe(2);
  expect(response.body.hasNextPage).toBe(false);

  expect(response.body.data).toHaveLength(2);
  expect(response.body.data[0]._id).toBe(meeting1._id.toString());
  expect(response.body.data[1]._id).toBe(meeting2._id.toString());
});
