import mongoose, { Schema } from 'mongoose';

export interface IMeeting {
  _id: mongoose.Types.ObjectId;
  userId: string;
  title: string;
  date: Date;
  participants: string[];
  transcript: string;
  summary: string;
  duration: number;
  actionItems: string[];
}

const meetingSchema = new Schema<IMeeting>({
  userId: {
    type: String,
    index: true,
  },
  title: String,
  date: {
    type: Date,
    index: true,
  },
  participants: [String],
  transcript: String,
  summary: String,
  duration: Number,
  actionItems: [String],
});

export const MeetingModel = mongoose.model<IMeeting>('Meeting', meetingSchema);
