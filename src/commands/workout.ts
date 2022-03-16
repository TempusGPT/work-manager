import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from ".";
import { WorkLog } from "../models/workLog";

const builder = new SlashCommandBuilder()
  .setName("workout")
  .setDescription("Let everyone know I'm out of work");

async function execute(interaction: CommandInteraction) {
  const workLog = await WorkLog.getCurrent(interaction.user.id);
  if (!workLog) {
    await interaction.reply({
      content: "You didn't use /workin. Did you forget to use /workin today?",
      ephemeral: true,
    });
    return;
  }

  const jobsDone = (await interaction.channel?.messages.fetch({ limit: 1 }))
    ?.filter((message) => message.author.id === interaction.user.id)
    .first()?.content;

  if (!jobsDone) {
    await interaction.reply({
      content: "Send today's achievements please! Then you can use /workout.",
      ephemeral: true,
    });
    return;
  }

  workLog.workOutTime = interaction.createdAt;
  workLog.jobsDone = jobsDone;
  workLog.save();
  await interaction.reply(`${interaction.user} is leaving the office.`);
}

export default { builder, execute } as Command;
