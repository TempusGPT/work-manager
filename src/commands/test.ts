import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from ".";

const builder = new SlashCommandBuilder()
  .setName("test")
  .setDescription("이건 그저 테스트이다");

async function execute(interaction: CommandInteraction) {
  await interaction.reply("test success");
}

export default { builder, execute } as Command;
