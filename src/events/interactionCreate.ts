import { CommandInteraction } from "discord.js";
import { Event } from ".";
import { getCommand } from "../commands";

const name = "interactionCreate";
const once = false;

async function execute(interaction: CommandInteraction) {
  if (!interaction.isCommand()) {
    return;
  }

  const command = getCommand(interaction.commandName);
  if (!command) {
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "커맨드를 실행하는 중 오류가 발생했습니다.",
      ephemeral: true,
    });
  }
}

export default { name, once, execute } as Event;
