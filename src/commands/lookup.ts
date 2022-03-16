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

const userOptionName = "user";
const previousButtonCustomID = "previous";
const nextButtonCustomID = "next";

const workLogsCount = 3;
let currentWorkLogs: WorkLogDocument[];

const firstPage = 0;
let lastPage: number;
let currentPage: number;

const builder = new SlashCommandBuilder()
  .setName("lookup")
  .setDescription("Lookup work logs")
  .addUserOption((option) =>
    option
      .setName(userOptionName)
      .setDescription("User to lookup work logs")
      .setRequired(true)
  );

async function execute(interaction: CommandInteraction) {
  const user = interaction.options.getUser(userOptionName);
  if (!user) {
    throw new Error(`The ${userOptionName} option does not exist`);
  }

  currentWorkLogs = (
    await WorkLog.find()
      .where("userID")
      .equals(user.id)
      .exists("workOutTime", true)
  ).reverse();

  currentPage = 0;
  lastPage = Math.ceil(currentWorkLogs.length / workLogsCount) - 1;

  await interaction.reply({
    content: generateContent(),
    embeds: await generateEmbeds(),
    components: [await generateButton()],
    ephemeral: true,
  });

  const collector = interaction.channel?.createMessageComponentCollector();

  collector?.on("collect", async (i) => {
    if (i.customId === previousButtonCustomID) {
      await previousButtonClicked(i);
    } else if (i.customId === nextButtonCustomID) {
      await nextButtonClicked(i);
    }
  });
}

function generateContent() {
  return `Page ${currentPage + 1} / ${lastPage + 1}`;
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
    ? date.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
    : "N/A";
}

async function generateButton() {
  return new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId(previousButtonCustomID)
        .setLabel("<")
        .setStyle("SECONDARY")
        .setDisabled(currentPage <= firstPage)
    )
    .addComponents(
      new MessageButton()
        .setCustomId(nextButtonCustomID)
        .setLabel(">")
        .setStyle("SECONDARY")
        .setDisabled(currentPage >= lastPage)
    );
}

async function previousButtonClicked(interaction: MessageComponentInteraction) {
  currentPage--;
  await interaction.update({
    content: generateContent(),
    embeds: await generateEmbeds(),
    components: [await generateButton()],
  });
}

async function nextButtonClicked(interaction: MessageComponentInteraction) {
  currentPage++;
  await interaction.update({
    content: generateContent(),
    embeds: await generateEmbeds(),
    components: [await generateButton()],
  });
}

export default { builder, execute } as Command;
