import { Client } from "discord.js";
import interactionCreate from "./interactionCreate";
import ready from "./ready";

export interface Event {
  name: string;
  once: boolean;
  execute(...args: unknown[]): Promise<void>;
}

const events = [ready, interactionCreate];

export function subscribeEvents(client: Client) {
  for (const event of events) {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
}
