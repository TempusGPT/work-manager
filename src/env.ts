import "dotenv/config";

function throwError(name: string): never {
  throw Error(name);
}

export const token = process.env.TOKEN ?? throwError("TOKEN");
export const clientID = process.env.CLIENT_ID ?? throwError("CLIENT_ID");
export const guildID = process.env.GUILD_ID ?? throwError("GUILD_ID");
