import { model, models, Document, Schema } from "mongoose";

export interface WorkLogDocument extends Document {
  userID: string;
  workInTime: number;
  workOutTime: number;
  jobsDone: string;
}

const schema = new Schema({
  userID: { type: String, required: true },
  workInTime: { type: Number, required: true },
  workOutTime: { type: Number },
  jobsDone: { type: String },
});

export const WorkLog =
  models.WorkLog ?? model<WorkLogDocument>("WorkLog", schema);
