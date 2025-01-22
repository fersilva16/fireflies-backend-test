import mongoose, { Schema } from 'mongoose';
import { TASK_STATUS_ENUM } from './TaskStatusEnum';

export interface ITask {
  meetingId: mongoose.Types.ObjectId;
  userId: string;
  title: string;
  description: string;
  status: TASK_STATUS_ENUM;
  dueDate: Date;
}

const taskSchema = new Schema<ITask>({
  meetingId: { type: Schema.Types.ObjectId, ref: 'Meeting' },
  userId: String,
  title: String,
  description: String,
  status: {
    type: String,
    enum: Object.values(TASK_STATUS_ENUM),
    default: TASK_STATUS_ENUM.PENDING,
  },
  dueDate: Date,
});

export const TaskModel = mongoose.model<ITask>('Task', taskSchema);
