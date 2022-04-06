import { Interaction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import lookup from "./lookup";
import remove from "./remove";
import workin from "./workin";
import workout from "./workout";

export interface Command {
  builder: SlashCommandBuilder;
  execute(interaction: Interaction): Promise<void>;
}

const commands = [workin, workout, lookup, remove];

export function getCommand(name: string) {
  for (const command of commands) {
    if (command.builder.name === name) {
      return command;
    }
  }
  return null;
}

export function getCommandsBody() {
  const body = [];
  for (const command of commands) {
    body.push(command.builder.toJSON());
  }
  return body;
}
