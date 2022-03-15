import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageComponentInteraction,
  MessageEmbed,
  User,
} from "discord.js";
import { Command } from ".";
import { WorkLog, WorkLogDocument } from "../models/workLog";

const userOptionName = "유저";
const previousButtonCustomID = "previous";
const nextButtonCustomID = "next";

const builder = new SlashCommandBuilder()
  .setName("조회")
  .setDescription("작업 기록 조회하기")
  .addUserOption((option) =>
    option
      .setName(userOptionName)
      .setDescription("작업 기록을 조회할 유저")
      .setRequired(true)
  );

async function execute(interaction: CommandInteraction) {
  const user = interaction.options.getUser(userOptionName);
  if (!user) {
    throw new Error("유저 option does not exist");
  }

  const workLogs = await WorkLog.find()
    .where("userID")
    .equals(user.id)
    .exists("workOutTime", true);

  await interaction.reply({
    content: "The first",
    embeds: await generateEmbeds(workLogs),
    components: [await generateButton()],
    ephemeral: true,
  });

  const collector = interaction.channel?.createMessageComponentCollector({
    filter: (i) => i.user.id === interaction.user.id,
    time: 15000,
  });

  collector?.on("collect", async (i) => {
    if (i.customId === previousButtonCustomID) {
      await previousButtonClicked(i, workLogs);
    } else if (i.customId === nextButtonCustomID) {
      await nextButtonClicked(i, workLogs);
    }
  });
}

async function generateEmbeds(workLogs: WorkLogDocument[]) {
  const result = [];
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

async function generateButton() {
  return new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId(previousButtonCustomID)
        .setLabel("<")
        .setStyle("SECONDARY")
    )
    .addComponents(
      new MessageButton()
        .setCustomId(nextButtonCustomID)
        .setLabel(">")
        .setStyle("SECONDARY")
    );
}

async function previousButtonClicked(
  interaction: MessageComponentInteraction,
  workLogs: WorkLogDocument[]
) {
  await interaction.update({
    content: "A previous button was clicked!",
    embeds: await generateEmbeds(workLogs),
  });
}

async function nextButtonClicked(
  interaction: MessageComponentInteraction,
  workLogs: WorkLogDocument[]
) {
  await interaction.update({
    content: "A next button was clicked!",
    embeds: await generateEmbeds(workLogs),
  });
}

export default { builder, execute } as Command;
