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

const idOptionName = "id";
const cancelButtonCustomID = "cancel";
const removeButtonCustomID = "remove";

const builder = new SlashCommandBuilder()
  .setName("remove")
  .setDescription("Remove a specific work log by ID")
  .addStringOption((option) =>
    option
      .setName(idOptionName)
      .setDescription("ID of the work log to be removed")
      .setRequired(true)
  );

async function execute(interaction: CommandInteraction) {
  const id = interaction.options.getString(idOptionName);
  if (!id) {
    throw new Error(`The ${idOptionName} option does not exist`);
  }

  const workLog = await WorkLog.findById(id);
  if (!workLog) {
    return await interaction.reply({
      content: `There is no work log with ID ${id}`,
      ephemeral: true,
    });
  }

  await interaction.reply({
    content: "You are about to remove the work log. Are you sure to remove?",
    embeds: [generateEmbed(workLog)],
    components: [generateButton()],
    ephemeral: true,
  });

  const collector = interaction.channel?.createMessageComponentCollector();
  collector?.on("collect", async (i) => {
    if (i.customId === cancelButtonCustomID) {
      await cancelButtonClicked(i);
    } else if (i.customId === removeButtonCustomID) {
      await removeButtonClicked(i, workLog);
    }
  });
}

function generateButton() {
  return new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId(cancelButtonCustomID)
        .setLabel("Cancel")
        .setStyle("SECONDARY")
    )
    .addComponents(
      new MessageButton()
        .setCustomId(removeButtonCustomID)
        .setLabel("Remove")
        .setStyle("DANGER")
    );
}

async function cancelButtonClicked(interaction: MessageComponentInteraction) {
  try {
    await interaction.update({
      content: "You canceled the work log removal.",
      components: [],
    });
  } catch (error) {
    console.error(error);
  }
}

async function removeButtonClicked(
  interaction: MessageComponentInteraction,
  workLog: WorkLogDocument
) {
  try {
    await workLog.delete();
    await interaction.update({
      content: "The work log has been removed!",
      components: [],
    });
  } catch (error) {
    console.error(error);
  }
}

export default { builder, execute } as Command;
