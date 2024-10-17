import type { GlobalSetupContext } from "vitest/node";

import { MongoMemoryServer } from "mongodb-memory-server";

export type { ProvidedContext } from "vitest";
export type { ResolvedConfig } from "vitest/node";

declare module "vitest" {
  export interface ProvidedContext {
    MONGO_URI: string;
  }
}

declare module "vitest/node" {
  export interface ResolvedConfig {
    vitestMms?: VitestMmsConfig;
  }
}

type MongoMemoryServerOpts = Parameters<typeof MongoMemoryServer.create>[0];

interface VitestMmsConfig {
  mongodbMemoryServerOptions: MongoMemoryServerOpts;
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
