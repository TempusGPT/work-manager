import { Client } from "discord.js";
import { Event } from ".";

const name = "ready";
const once = true;

function execute(client: Client) {
  console.log(`Ready: ${client.user?.tag}`);
}

export default { name, once, execute } as Event;
