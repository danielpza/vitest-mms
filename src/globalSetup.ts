import type { GlobalSetupContext } from "vitest/node" with { "resolution-mode": "require" };

import { MongoMemoryServer } from "mongodb-memory-server";

export type { ProvidedContext } from "vitest";
export type { ResolvedConfig } from "vitest/node" with { "resolution-mode": "require" };

declare module "vitest" {
  export interface ProvidedContext {
    MONGO_URI: string;
  }
}

type MongoMemoryServerOpts = Parameters<typeof MongoMemoryServer.create>[0];

// @ts-ignore
declare module "vitest/node" {
  export interface ResolvedConfig {
    vitestMms?: {
      mongodbMemoryServerOptions: MongoMemoryServerOpts;
    };
  }
}

export default async function setup({ provide, config }: GlobalSetupContext) {
  const mongod = await MongoMemoryServer.create(
    config.vitestMms?.mongodbMemoryServerOptions,
  );

  const uri = mongod.getUri();

  provide("MONGO_URI", uri);

  return async () => {
    await mongod.stop();
  };
}
