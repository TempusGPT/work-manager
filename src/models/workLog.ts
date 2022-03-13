import { model, Document, Model, Schema } from "mongoose";

export interface WorkLogDocument extends Document {
  userID: string;
  workInTime: number;
  workOutTime: number;
  jobsDone: string;
}

interface WorkLogModel extends Model<WorkLogDocument> {
  getCurrent: (userID: string) => Promise<WorkLogDocument | null>;
}

const schema = new Schema({
  userID: { type: String, required: true },
  workInTime: { type: Number, required: true },
  workOutTime: { type: Number },
  jobsDone: { type: String },
});

schema.statics.getCurrent = async function (userID: string) {
  return await this.findOne({ userID, workOutTime: undefined });
};

export const WorkLog = model<WorkLogDocument, WorkLogModel>("WorkLog", schema);
