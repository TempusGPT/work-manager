import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
import lookup from "./lookup";
import workIn from "./workIn";
import workOut from "./workOut";

export interface Command {
  builder: SlashCommandBuilder;
  execute(interaction: Interaction): Promise<void>;
}

const commands = [workIn, workOut, lookup];

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
