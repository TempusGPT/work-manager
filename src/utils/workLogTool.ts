import { MessageEmbed } from "discord.js";
import { WorkLogDocument } from "../models/workLog";

const notAvailable = "N/A";

export function generateEmbed(workLog: WorkLogDocument) {
  return new MessageEmbed()
    .setTitle(workLog.id)
    .setDescription(workLog.jobsDone ?? notAvailable)
    .addField("Work In", formatDate(workLog.workInTime))
    .addField("Work Out", formatDate(workLog.workOutTime));
}

function formatDate(date: Date | undefined) {
  return date
    ? date.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
    : notAvailable;
}
