import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  meetingId: mongoose.Types.ObjectId;
  userId: string;
  title: string;
  description: string;
  status: "pending" | "inProgress" | "completed";
  dueDate: Date;
}

const taskSchema = new Schema<ITask>({
  meetingId: { type: Schema.Types.ObjectId, ref: "Meeting" },
  userId: String,
  title: String,
  description: String,
  status: {
    type: String,
    enum: ["pending", "inProgress", "completed"],
    default: "pending",
  },
  dueDate: Date,
});

export const Task = mongoose.model<ITask>("Task", taskSchema);
