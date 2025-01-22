import request from 'supertest';
import { afterEach, expect, it, vi } from 'vitest';

import { app } from '../../app';

afterEach(() => {
  vi.restoreAllMocks();
});

it('should return the welcome message', async () => {
  const response = await request(app.callback()).get('/');

  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Welcome to the MeetingBot API');
});
