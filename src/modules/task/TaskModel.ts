import mongoose, { Schema } from 'mongoose';

import { TASK_STATUS_ENUM } from './TaskStatusEnum';

export interface ITask {
  _id: mongoose.Types.ObjectId;
  meetingId: mongoose.Types.ObjectId;
  userId: string;
  title: string;
  description: string;
  status: TASK_STATUS_ENUM;
  dueDate?: Date;
}

const taskSchema = new Schema<ITask>({
  meetingId: {
    type: Schema.Types.ObjectId,
    ref: 'Meeting',
    index: true,
  },
  userId: {
    type: String,
    index: true,
  },
  title: String,
  description: String,
  status: {
    type: String,
    enum: Object.values(TASK_STATUS_ENUM),
    default: TASK_STATUS_ENUM.PENDING,
    index: true,
  },
  dueDate: {
    type: Date,
    index: true,
  },
});

export const TaskModel = mongoose.model<ITask>('Task', taskSchema);
