import type { IMeeting } from './MeetingModel';

// Map the Meeting document for the API response (do not expose unnecessary fields)
export const meetingApiMap = (meeting: IMeeting) => {
  return {
    _id: meeting._id.toString(),
    title: meeting.title,
    date: meeting.date.toISOString(),
    participants: meeting.participants,
    transcript: meeting.transcript,
    summary: meeting.summary,
    duration: meeting.duration,
    actionItems: meeting.actionItems,
  };
};
