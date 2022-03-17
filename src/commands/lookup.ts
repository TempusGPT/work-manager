import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageComponentInteraction,
} from "discord.js";
import { Command } from ".";
import { WorkLog, WorkLogDocument } from "../models/workLog";
import { generateEmbed } from "../utils/workLogTool";

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

  if (currentWorkLogs.length === 0) {
    return await interaction.reply({
      content: `There is no work logs for ${user}.`,
      ephemeral: true,
    });
  }

  currentPage = 0;
  lastPage = Math.ceil(currentWorkLogs.length / workLogsCount) - 1;

  await interaction.reply({
    content: generateContent(),
    embeds: generateEmbeds(),
    components: [generateButton()],
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

function generateEmbeds() {
  const result = [];
  const start = currentPage * workLogsCount;
  const end = (currentPage + 1) * workLogsCount;

  for (const workLog of currentWorkLogs.slice(start, end)) {
    result.push(generateEmbed(workLog));
  }
  return result;
}

function generateButton() {
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
  try {
    currentPage--;
    await interaction.update({
      content: generateContent(),
      embeds: generateEmbeds(),
      components: [generateButton()],
    });
  } catch (error) {
    console.error(error);
  }
}

async function nextButtonClicked(interaction: MessageComponentInteraction) {
  try {
    currentPage++;
    await interaction.update({
      content: generateContent(),
      embeds: generateEmbeds(),
      components: [generateButton()],
    });
  } catch (error) {
    console.error(error);
  }
}

export default { builder, execute } as Command;
