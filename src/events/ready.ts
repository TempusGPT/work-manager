import { Client } from "discord.js";
import { Event } from ".";

export default {
  name: "ready",
  once: true,
  execute(client: Client) {
    console.log(`Ready as ${client.user?.tag}.`);
  },
} as Event;
