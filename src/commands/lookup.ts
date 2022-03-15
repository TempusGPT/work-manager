import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed, User } from "discord.js";
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
  await interaction.reply({ embeds: await generateEmbeds(interaction.user) });
}

async function generateEmbeds(user: User) {
  const result = [];
  for (const log of await WorkLog.find({ userID: user.id })) {
    result.push(
      new MessageEmbed()
        .setTitle(log.workInTime.toDateString())
        .setDescription(log.jobsDone ?? "")
    );
  }
  return result;
}

export default { builder, execute } as Command;
