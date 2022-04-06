import { Client, Intents } from "discord.js";
import { channelID, mongoURI, token } from "./utils/env";
import { subscribeEvents } from "./events";
import { connect as connectMongoDB } from "mongoose";
import { scheduleJob } from "node-schedule";

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

scheduleJob({ hour: 21, dayOfWeek: 6 }, async () => {
  const channel = await client.channels.fetch(channelID);
  if (channel?.isText()) {
    channel.send("Show me the results of the week!");
  } else {
    console.error("Channel ID is wrong.");
  }
});
