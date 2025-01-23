import type { ITask } from './TaskModel';

// Map the Task document for the API response (do not expose unnecessary fields)
export const taskApiMap = (task: ITask) => {
  return {
    _id: task._id.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate?.toISOString(),
  };
};
