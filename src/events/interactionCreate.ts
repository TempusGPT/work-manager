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
    await interaction.reply({
      content: `${error}`,
      ephemeral: true,
    });
  }
}

export default { name, once, execute } as Event;
