import { CommandInteraction } from "discord.js";
import { Event } from ".";

export default {
  name: "interactionCreate",
  once: false,
  async execute(interaction: CommandInteraction): Promise<void> {
    if (!interaction.isCommand()) {
      return;
    }
  },
} as Event;
