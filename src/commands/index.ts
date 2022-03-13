import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
import test from "./test";

export interface Command {
  builder: SlashCommandBuilder;
  execute(interaction: Interaction): Promise<void>;
}

const commands = [test];

export function getCommand(name: string): Command | null {
  for (const command of commands) {
    if (command.builder.name === name) {
      return command;
    }
  }
  return null;
}
