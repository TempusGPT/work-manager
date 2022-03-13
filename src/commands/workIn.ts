import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from ".";
import { WorkLog } from "../models/WorkLog";

const builder = new SlashCommandBuilder()
  .setName("출근")
  .setDescription("내가 출근한 걸 모두에게 알리기");

async function execute(interaction: CommandInteraction) {
  const workLog = await WorkLog.getCurrent(interaction.user.id);
  if (workLog) {
    await interaction.reply({
      content: "이미 출근하셨습니다. 혹시 어제 퇴근하는 걸 까먹으셨나요?",
      ephemeral: true,
    });
  } else {
    WorkLog.create({
      userID: interaction.user.id,
      workInTime: interaction.createdTimestamp,
    });
    await interaction.reply(`${interaction.user.username}님이 출근했습니다.`);
  }
}

export default { builder, execute } as Command;
