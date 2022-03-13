import "dotenv/config";

function throwError(name: string): never {
  throw Error(name);
}

export const token = process.env.TOKEN ?? throwError("TOKEN");
