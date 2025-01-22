import request from 'supertest';
import { afterAll, beforeAll, expect, it, vi } from 'vitest';

import { app } from '../../../../app';
import { meetingFixture } from '../../../meeting/meetingFixture';
import { TASK_STATUS_ENUM } from '../../../task/TaskStatusEnum';
import { taskFixture } from '../../../task/taskFixture';

beforeAll(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});

it('should return the dashboard', async () => {
  vi.setSystemTime(new Date(2025, 0, 22, 12, 0, 0));

  const userId = 'user1';

  const meeting1 = await meetingFixture({
    userId,
    title: 'Meeting 1',
    date: new Date(2025, 0, 1, 12, 0, 0),
    participants: ['John Doe', 'Alice Brown'],
  });

  const task1 = await taskFixture({
    userId,
    meetingId: meeting1._id,
    title: 'Task 1',
    dueDate: new Date(2025, 0, 3, 12, 0, 0),
  });

  await taskFixture({
    userId,
    meetingId: meeting1._id,
    title: 'Task 2',
    dueDate: new Date(2025, 0, 4, 12, 0, 0),
    status: TASK_STATUS_ENUM.COMPLETED,
  });

  const meeting2 = await meetingFixture({
    userId,
    title: 'Meeting 2',
    date: new Date(2025, 0, 2, 12, 0, 0),
    participants: ['John Doe'],
  });

  const task3 = await taskFixture({
    userId,
    meetingId: meeting2._id,
    title: 'Task 3',
    dueDate: new Date(2025, 0, 3, 12, 0, 0),
    status: TASK_STATUS_ENUM.IN_PROGRESS,
  });

  const meeting3 = await meetingFixture({
    userId,
    title: 'Meeting 3',
    date: new Date(2025, 1, 12, 12, 0, 0),
    participants: ['John Doe', 'Alice Brown'],
  });

  await taskFixture({
    userId,
    meetingId: meeting3._id,
    title: 'Task 4',
    dueDate: new Date(2025, 1, 14, 12, 0, 0),
  });

  await taskFixture({
    userId,
    meetingId: meeting3._id,
    title: 'Task 5',
    dueDate: new Date(2025, 1, 15, 12, 0, 0),
    status: TASK_STATUS_ENUM.IN_PROGRESS,
  });

  const response = await request(app.callback())
    .get('/api/dashboard')
    .set('x-user-id', userId);

  expect(response.status).toBe(200);

  expect(response.body).toEqual({
    overdueTasks: [
      {
        _id: task1._id.toString(),
        dueDate: '2025-01-03T15:00:00.000Z',
        meetingId: meeting1._id.toString(),
        meetingTitle: 'Meeting 1',
        title: 'Task 1',
      },
      {
        _id: task3._id.toString(),
        dueDate: '2025-01-03T15:00:00.000Z',
        meetingId: meeting2._id.toString(),
        meetingTitle: 'Meeting 2',
        title: 'Task 3',
      },
    ],
    taskSummary: {
      completed: 1,
      inProgress: 2,
      pending: 2,
    },
    totalMeetings: 3,
    upcomingMeetings: [
      {
        date: '2025-02-12T15:00:00.000Z',
        participantCount: 2,
        title: 'Meeting 3',
      },
    ],
  });
});

it('should not return the dashboard if user is not authenticated', async () => {
  const response = await request(app.callback()).get('/api/dashboard');

  expect(response.status).toBe(401);
  expect(response.body.message).toBe('Authentication required');
});

it('should return the dashboard without meetings and tasks from other user', async () => {
  vi.setSystemTime(new Date(2025, 0, 22, 12, 0, 0));

  const userId = 'user1';

  const meeting1 = await meetingFixture({
    userId,
    title: 'Meeting 1',
    date: new Date(2025, 0, 1, 12, 0, 0),
    participants: ['John Doe', 'Alice Brown'],
  });

  const task1 = await taskFixture({
    userId,
    meetingId: meeting1._id,
    title: 'Task 1',
    dueDate: new Date(2025, 0, 3, 12, 0, 0),
  });

  await taskFixture({
    userId,
    meetingId: meeting1._id,
    title: 'Task 2',
    dueDate: new Date(2025, 0, 4, 12, 0, 0),
    status: TASK_STATUS_ENUM.COMPLETED,
  });

  const meeting2 = await meetingFixture({
    userId,
    title: 'Meeting 2',
    date: new Date(2025, 0, 2, 12, 0, 0),
    participants: ['John Doe'],
  });

  const task3 = await taskFixture({
    userId,
    meetingId: meeting2._id,
    title: 'Task 3',
    dueDate: new Date(2025, 0, 3, 12, 0, 0),
    status: TASK_STATUS_ENUM.IN_PROGRESS,
  });

  const meeting3 = await meetingFixture({
    userId,
    title: 'Meeting 3',
    date: new Date(2025, 1, 12, 12, 0, 0),
    participants: ['John Doe', 'Alice Brown'],
  });

  await taskFixture({
    userId,
    meetingId: meeting3._id,
    title: 'Task 4',
    dueDate: new Date(2025, 1, 14, 12, 0, 0),
  });

  await taskFixture({
    userId,
    meetingId: meeting3._id,
    title: 'Task 5',
    dueDate: new Date(2025, 1, 15, 12, 0, 0),
    status: TASK_STATUS_ENUM.IN_PROGRESS,
  });

  const meeting4 = await meetingFixture({
    userId: 'user2',
    title: 'Meeting 4',
    date: new Date(2025, 1, 13, 12, 0, 0),
    participants: ['John Doe', 'Alice Brown'],
  });

  await taskFixture({
    userId: 'user2',
    meetingId: meeting4._id,
    title: 'Task 6',
    dueDate: new Date(2025, 1, 16, 12, 0, 0),
    status: TASK_STATUS_ENUM.COMPLETED,
  });

  await taskFixture({
    userId: 'user2',
    meetingId: meeting4._id,
    title: 'Task 7',
    dueDate: new Date(2025, 1, 17, 12, 0, 0),
    status: TASK_STATUS_ENUM.IN_PROGRESS,
  });

  await taskFixture({
    userId: 'user2',
    meetingId: meeting4._id,
    title: 'Task 8',
    dueDate: new Date(2025, 1, 18, 12, 0, 0),
    status: TASK_STATUS_ENUM.PENDING,
  });

  const response = await request(app.callback())
    .get('/api/dashboard')
    .set('x-user-id', userId);

  expect(response.status).toBe(200);

  expect(response.body).toEqual({
    overdueTasks: [
      {
        _id: task1._id.toString(),
        dueDate: '2025-01-03T15:00:00.000Z',
        meetingId: meeting1._id.toString(),
        meetingTitle: 'Meeting 1',
        title: 'Task 1',
      },
      {
        _id: task3._id.toString(),
        dueDate: '2025-01-03T15:00:00.000Z',
        meetingId: meeting2._id.toString(),
        meetingTitle: 'Meeting 2',
        title: 'Task 3',
      },
    ],
    taskSummary: {
      completed: 1,
      inProgress: 2,
      pending: 2,
    },
    totalMeetings: 3,
    upcomingMeetings: [
      {
        date: '2025-02-12T15:00:00.000Z',
        participantCount: 2,
        title: 'Meeting 3',
      },
    ],
  });
});

it('should return the dashboard empty if there are no meetings nor tasks', async () => {
  const userId = 'user1';

  const response = await request(app.callback())
    .get('/api/dashboard')
    .set('x-user-id', userId);

  expect(response.status).toBe(200);

  expect(response.body).toEqual({
    overdueTasks: [],
    taskSummary: {
      completed: 0,
      inProgress: 0,
      pending: 0,
    },
    totalMeetings: 0,
    upcomingMeetings: [],
  });
});
