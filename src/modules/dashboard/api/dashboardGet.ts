import type { ParameterizedContext } from 'koa';
import { Types } from 'mongoose';

import type { AuthenticatedState } from '../../../middleware/authMiddleware';
import { MeetingModel } from '../../meeting/MeetingModel';
import { TaskModel } from '../../task/TaskModel';
import { TASK_STATUS_ENUM } from '../../task/TaskStatusEnum';

interface UpcomingMeeting {
  _id: Types.ObjectId;
  title: string;
  date: Date;
  participantCount: number;
}

interface TaskSummary {
  pending: number;
  inProgress: number;
  completed: number;
}

interface OverdueTask {
  _id: Types.ObjectId;
  title: string;
  dueDate: Date;
  meetingId: Types.ObjectId;
  meetingTitle: string;
}

export const dashboardGet = async (
  ctx: ParameterizedContext<AuthenticatedState>,
) => {
  const totalMeetings = await MeetingModel.countDocuments({
    userId: ctx.state.userId,
  });

  const upcomingMeetings = await MeetingModel.aggregate<UpcomingMeeting>([
    {
      $match: {
        userId: ctx.state.userId,
        date: { $gte: new Date() },
      },
    },
    {
      $sort: {
        date: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        _id: 0,
        title: 1,
        date: 1,
        participantCount: { $size: '$participants' },
      },
    },
  ]);

  const [taskSummary] = await TaskModel.aggregate<TaskSummary>([
    {
      $match: {
        userId: ctx.state.userId,
      },
    },
    {
      $group: {
        _id: null,
        pending: {
          $sum: {
            $cond: [{ $eq: ['$status', TASK_STATUS_ENUM.PENDING] }, 1, 0],
          },
        },
        inProgress: {
          $sum: {
            $cond: [{ $eq: ['$status', TASK_STATUS_ENUM.IN_PROGRESS] }, 1, 0],
          },
        },
        completed: {
          $sum: {
            $cond: [{ $eq: ['$status', TASK_STATUS_ENUM.COMPLETED] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        pending: 1,
        inProgress: 1,
        completed: 1,
      },
    },
  ]);

  const overdueTasks = await TaskModel.aggregate<OverdueTask>([
    {
      $match: {
        userId: ctx.state.userId,
        dueDate: { $lte: new Date() },
        status: { $ne: TASK_STATUS_ENUM.COMPLETED },
      },
    },
    {
      $lookup: {
        from: MeetingModel.collection.name,
        localField: 'meetingId',
        foreignField: '_id',
        as: 'meeting',
      },
    },
    {
      $unwind: {
        path: '$meeting',
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        dueDate: 1,
        meetingId: '$meeting._id',
        meetingTitle: '$meeting.title',
      },
    },
  ]);

  ctx.body = {
    totalMeetings,
    upcomingMeetings,
    taskSummary: {
      pending: taskSummary?.pending ?? 0,
      inProgress: taskSummary?.inProgress ?? 0,
      completed: taskSummary?.completed ?? 0,
    },
    overdueTasks,
  };
};
