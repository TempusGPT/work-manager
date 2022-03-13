import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from ".";

const builder = new SlashCommandBuilder()
  .setName("출근")
  .setDescription("이것은 그저 출근");

async function execute(interaction: CommandInteraction) {
  await interaction.reply("출근 success");
}

export default { builder, execute } as Command;
