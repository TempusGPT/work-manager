import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageComponentInteraction,
  MessageEmbed,
} from "discord.js";
import { Command } from ".";
import { WorkLog, WorkLogDocument } from "../models/workLog";

const userOptionName = "유저";
const previousButtonCustomID = "previous";
const nextButtonCustomID = "next";

const workLogsCount = 3;
let currentPage: number;
let currentWorkLogs: WorkLogDocument[];

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

  currentPage = 0;
  currentWorkLogs = (
    await WorkLog.find()
      .where("userID")
      .equals(user.id)
      .exists("workOutTime", true)
  ).reverse();

  await interaction.reply({
    content: currentPage.toString(),
    embeds: await generateEmbeds(),
    components: [await generateButton()],
    ephemeral: true,
  });

  const collector = interaction.channel?.createMessageComponentCollector({
    filter: (i) => i.user.id === interaction.user.id,
    time: 15000,
  });

  collector?.on("collect", async (i) => {
    if (i.customId === previousButtonCustomID) {
      await previousButtonClicked(i);
    } else if (i.customId === nextButtonCustomID) {
      await nextButtonClicked(i);
    }
  });
}

async function generateEmbeds() {
  const result = [];
  const start = currentPage * workLogsCount;
  const end = (currentPage + 1) * workLogsCount;

  for (const workLog of currentWorkLogs.slice(start, end)) {
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
        .setDisabled(currentPage <= 0)
    )
    .addComponents(
      new MessageButton()
        .setCustomId(nextButtonCustomID)
        .setLabel(">")
        .setStyle("SECONDARY")
        .setDisabled(
          currentPage >= Math.ceil(currentWorkLogs.length / workLogsCount) - 1
        )
    );
}

async function previousButtonClicked(interaction: MessageComponentInteraction) {
  currentPage--;
  await interaction.update({
    content: currentPage.toString(),
    embeds: await generateEmbeds(),
    components: [await generateButton()],
  });
}

async function nextButtonClicked(interaction: MessageComponentInteraction) {
  currentPage++;
  await interaction.update({
    content: currentPage.toString(),
    embeds: await generateEmbeds(),
    components: [await generateButton()],
  });
}

export default { builder, execute } as Command;
