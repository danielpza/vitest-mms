import type { GlobalSetupContext } from "vitest/node";

import { MongoMemoryServer } from "mongodb-memory-server";

export type { ProvidedContext } from "vitest";
export type { ResolvedConfig } from "vitest/node";

declare module "vitest" {
  export interface ProvidedContext {
    MONGO_URI: string;
  }
}

type MongoMemoryServerOpts = Parameters<typeof MongoMemoryServer.create>[0];

declare module "vitest/node" {
  export interface ResolvedConfig {
    vitestMms?: {
      mongodbMemoryServerOptions: MongoMemoryServerOpts;
    };
  }
}

export default async function setup({ provide, config }: GlobalSetupContext) {
  console.log(config.vitestMms);
  const mongod = await MongoMemoryServer.create(
    config.vitestMms?.mongodbMemoryServerOptions,
  );

  const uri = mongod.getUri();

  provide("MONGO_URI", uri);

  return async () => {
    await mongod.stop();
  };
}
