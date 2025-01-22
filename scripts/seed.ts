import mongoose from 'mongoose';

import { MeetingModel, type IMeeting } from '../src/meeting/MeetingModel.js';
import { mongooseConnect } from '../src/mongoose/mongooseConnect';
import { TaskModel, type ITask } from '../src/task/TaskModel.js';
import { TASK_STATUS_ENUM } from '../src/task/TaskStatusEnum.js';

await mongooseConnect();

const users = ['user1', 'user2', 'user3', 'user4', 'user5'];
const participants = [
  'Alice',
  'Bob',
  'Charlie',
  'David',
  'Eva',
  'Frank',
  'Grace',
  'Henry',
  'Ivy',
  'Jack',
];

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function randomParticipants(): string[] {
  const count = Math.floor(Math.random() * 5) + 2; // 2 to 6 participants
  return participants.sort(() => 0.5 - Math.random()).slice(0, count);
}

async function seedMeetings() {
  await MeetingModel.deleteMany({});

  const meetings: IMeeting[] = [];

  for (let i = 0; i < 100; i++) {
    const userId = users[Math.floor(Math.random() * users.length)];
    const meeting = new MeetingModel({
      userId: userId,
      title: `Meeting ${i + 1}`,
      date: randomDate(new Date(2023, 0, 1), new Date()),
      participants: randomParticipants(),
      transcript: `This is a sample transcript for meeting ${i + 1}.`,
      duration: Math.floor(Math.random() * 120) + 30,
      summary: `Summary of meeting ${i + 1}`,
      actionItems: [
        `Action item 1 for meeting ${i + 1}`,
        `Action item 2 for meeting ${i + 1}`,
      ],
    });
    meetings.push(meeting);
  }

  await MeetingModel.insertMany(meetings);

  console.log('Meetings seeded successfully');
}

async function seedTasks() {
  await TaskModel.deleteMany({});

  const meetings = await MeetingModel.find();
  const tasks: ITask[] = [];

  for (const meeting of meetings) {
    const taskCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 tasks per meeting
    for (let i = 0; i < taskCount; i++) {
      const task = new TaskModel({
        meetingId: meeting._id,
        userId: meeting.userId,
        title: `Task ${i + 1} from ${meeting.title}`,
        description: `This is a sample task from meeting ${meeting.title}`,
        status: Object.values(TASK_STATUS_ENUM)[Math.floor(Math.random() * 3)],
        dueDate: new Date(
          meeting.date.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000,
        ), // Random date within a week of the meeting
      });
      tasks.push(task);
    }
  }

  await TaskModel.insertMany(tasks);

  console.log('Tasks seeded successfully');
}

await seedMeetings();
await seedTasks();
await mongoose.connection.close();
