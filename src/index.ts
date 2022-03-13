import { Client, Intents } from "discord.js";
import { token } from "./env";
import { subscribeEvents } from "./events";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
subscribeEvents(client);
client.login(token);
