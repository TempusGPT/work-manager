import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  User,
} from "discord.js";
import { Command } from ".";
import { WorkLog } from "../models/workLog";

const builder = new SlashCommandBuilder()
  .setName("조회")
  .setDescription("작업 기록 조회하기")
  .addUserOption((option) =>
    option
      .setName("유저")
      .setDescription("작업 기록을 조회할 유저")
      .setRequired(true)
  );

async function execute(interaction: CommandInteraction) {
  const user = interaction.options.getUser("유저");
  if (!user) {
    throw new Error("유저 option does not exist");
  }
  await interaction.reply({
    embeds: await generateEmbeds(user),
    components: [await generateButton()],
  });
}

async function generateButton() {
  return new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId("previous")
        .setLabel("<")
        .setStyle("SECONDARY")
    )
    .addComponents(
      new MessageButton()
        .setCustomId("next")
        .setLabel(">")
        .setStyle("SECONDARY")
    )
    .addComponents(
      new MessageButton()
        .setCustomId("close")
        .setLabel("Close")
        .setStyle("DANGER")
    );
}

async function generateEmbeds(user: User) {
  const result = [];
  const workLogs = await WorkLog.find()
    .where("userID")
    .equals(user.id)
    .exists("workOutTime", true);

  for (const workLog of workLogs) {
    result.push(
      new MessageEmbed()
        .setDescription(workLog.jobsDone ?? "N/A")
        .addField("Work In", formatDate(workLog.workInTime))
        .addField("Work Out", formatDate(workLog.workOutTime))
    );
  }
  return result;
}

function formatDate(date: Date | undefined) {
  return date
    ? `${date.getHours()}:${date.getMinutes()} ${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`
    : "N/A";
}

export default { builder, execute } as Command;
