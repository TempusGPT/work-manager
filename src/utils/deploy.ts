import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/rest/v9";
import { getCommandsBody } from "../commands";
import { clientID, guildID, token } from "./env";

(async () => {
  try {
    const rest = new REST({ version: "9" }).setToken(token);
    await rest.put(Routes.applicationGuildCommands(clientID, guildID), {
      body: getCommandsBody(),
    });
    console.log("Deployed commands");
  } catch (error) {
    console.error(error);
  }
})();
