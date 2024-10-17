import type { GlobalSetupContext } from "vitest/node";

import { MongoMemoryReplSet } from "mongodb-memory-server";

export type { ProvidedContext } from "vitest";
export type { ResolvedConfig } from "vitest/node";

declare module "vitest" {
  export interface ProvidedContext {
    MONGO_URI: string;
  }
}

type MongoMemoryServerOpts = Parameters<typeof MongoMemoryReplSet.create>[0];

declare module "vitest/node" {
  export interface ResolvedConfig {
    vitestMms?: {
      mongodbMemoryServerOptions: MongoMemoryServerOpts;
    };
  }
}

export default async function setup({ provide, config }: GlobalSetupContext) {
  const mongod = await MongoMemoryReplSet.create(
    config.vitestMms?.mongodbMemoryServerOptions,
  );

  const uri = mongod.getUri();

  provide("MONGO_URI", uri);

  return async () => {
    await mongod.stop();
  };
}
