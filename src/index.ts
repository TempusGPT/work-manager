import { Client, Intents } from "discord.js";
import { mongoURI, token } from "./utils/env";
import { subscribeEvents } from "./events";
import { connect as connectMongoDB } from "mongoose";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
subscribeEvents(client);
client.login(token);

(async () => {
  try {
    await connectMongoDB(mongoURI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
  }
})();
