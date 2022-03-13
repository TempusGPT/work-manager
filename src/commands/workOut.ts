import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from ".";
import { WorkLog } from "../models/workLog";

const builder = new SlashCommandBuilder()
  .setName("퇴근")
  .setDescription("내가 퇴근하는 걸 모두에게 알리기");

async function execute(interaction: CommandInteraction) {
  const workLog = await WorkLog.getCurrent(interaction.user.id);
  if (!workLog) {
    await interaction.reply({
      content:
        "출근도 안 하시고 퇴근하려 하시네요. 혹시 출근하는 걸 까먹으셨나요?",
      ephemeral: true,
    });
    return;
  }

  workLog.workOutTime = interaction.createdAt;
  workLog.save();
  await interaction.reply(`${interaction.user.username}님이 퇴근하십니다...`);
}

export default { builder, execute } as Command;
