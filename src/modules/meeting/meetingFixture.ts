import { MeetingModel, type IMeeting } from './MeetingModel';

export const meetingFixture = async (args: Partial<IMeeting> = {}) => {
  return await new MeetingModel({
    title: 'Meeting Title',
    date: new Date(),
    duration: 120,
    ...args,
  }).save();
};
