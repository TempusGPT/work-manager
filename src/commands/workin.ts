import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from ".";
import { WorkLog } from "../models/workLog";

const builder = new SlashCommandBuilder()
  .setName("workin")
  .setDescription("Let everyone know I'm at work");

async function execute(interaction: CommandInteraction) {
  const workLog = await WorkLog.getCurrent(interaction.user.id);
  if (workLog) {
    await interaction.reply({
      content:
        "You already used /workin. Did you forget to use /workout yesterday?",
      ephemeral: true,
    });
    return;
  }

  await WorkLog.create({
    userID: interaction.user.id,
    workInTime: interaction.createdAt,
  });
  await interaction.reply(`${interaction.user.username} is here to work!`);
}

export default { builder, execute } as Command;
