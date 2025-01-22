import { TaskModel, type ITask } from './TaskModel';
import { TASK_STATUS_ENUM } from './TaskStatusEnum';

export const taskFixture = async (args: Partial<ITask> = {}) => {
  return await new TaskModel({
    title: 'Task Title',
    description: 'Task Description',
    dueDate: new Date(),
    status: TASK_STATUS_ENUM.PENDING,
    ...args,
  }).save();
};
