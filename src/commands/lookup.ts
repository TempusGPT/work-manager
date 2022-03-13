import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from ".";

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
  await interaction.reply({ embeds: [generateEmbed()] });
}

function generateEmbed() {
  return new MessageEmbed().setTitle("Embed");
}

export default { builder, execute } as Command;
