import { model, Document, Model, Schema } from "mongoose";

export interface WorkLogDocument extends Document {
  userID: string;
  workInTime: Date;
  workOutTime: Date;
  jobsDone: string;
}

interface WorkLogModel extends Model<WorkLogDocument> {
  getCurrent: (userID: string) => Promise<WorkLogDocument | null>;
}

const schema = new Schema({
  userID: { type: String, required: true },
  workInTime: { type: Date, required: true },
  workOutTime: { type: Date },
  jobsDone: { type: String },
});

schema.statics.getCurrent = async function (userID: string) {
  return await this.findOne({ userID, workOutTime: undefined });
};

export const WorkLog = model<WorkLogDocument, WorkLogModel>("WorkLog", schema);
