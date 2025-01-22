import mongoose, { Document, Schema } from "mongoose";

export interface IMeeting extends Document {
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
  userId: String,
  title: String,
  date: Date,
  participants: [String],
  transcript: String,
  summary: String,
  duration: Number,
  actionItems: [String],
});

export const Meeting = mongoose.model<IMeeting>("Meeting", meetingSchema);
