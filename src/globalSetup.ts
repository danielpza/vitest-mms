import { MongoMemoryServer } from "mongodb-memory-server";

export type { ProvidedContext } from "vitest";
import type { GlobalSetupContext } from "vitest/node";

declare module "vitest" {
  export interface ProvidedContext {
    MONGO_URI: string;
  }
}

export default async function setup({ provide }: GlobalSetupContext) {
  const mongod = await MongoMemoryServer.create();

  const uri = mongod.getUri();

  provide("MONGO_URI", uri);

  return async () => {
    await mongod.stop();
  };
}
