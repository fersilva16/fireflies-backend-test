import { afterEach } from 'node:test';
import request from 'supertest';
import { beforeAll, expect, it, vi } from 'vitest';

import { app } from '../../../../app';
import { summaryProviderRegister } from '../../../summaryProvider/summaryProviderRegister';
import { mockSummaryProvider } from '../../../summaryProviderMock/MockSummaryProvider';
import { TaskModel } from '../../../task/TaskModel';
import { MeetingModel } from '../../MeetingModel';
import { meetingFixture } from '../../meetingFixture';

beforeAll(() => {
  summaryProviderRegister(mockSummaryProvider);
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('should summarize a meeting', async () => {
  vi.spyOn(Math, 'random').mockImplementation(() => 0.5);

  const userId = 'user1';

  const meeting = await meetingFixture({
    userId,
    transcript: 'This is the transcript',
  });

  const response = await request(app.callback())
    .post(`/api/meetings/${meeting._id.toString()}/summarize`)
    .set('x-user-id', userId)
    .set('content-type', 'application/json');

  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Summarization successful');

  const meetings = await MeetingModel.find();

  expect(meetings).toHaveLength(1);

  const [meetingUpdated] = meetings;

  expect(meetingUpdated?._id.toString()).toBe(meeting._id.toString());
  expect(meetingUpdated?.summary).toBe('This is the tra');
  expect(meetingUpdated?.actionItems).toEqual([
    'Action item 1',
    'Action item 2',
  ]);

  const tasks = await TaskModel.find();

  expect(tasks).toHaveLength(2);

  expect(tasks[0]?.meetingId.toString()).toBe(meeting._id.toString());
  expect(tasks[0]?.title).toBe('Action item 1');

  expect(tasks[1]?.meetingId.toString()).toBe(meeting._id.toString());
  expect(tasks[1]?.title).toBe('Action item 2');
});
