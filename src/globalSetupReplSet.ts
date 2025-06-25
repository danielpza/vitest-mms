import type { TestProject } from "vitest/node";

import { MongoMemoryReplSet } from "mongodb-memory-server";

export type { ProvidedContext } from "vitest";
export type { ResolvedConfig } from "vitest/node" with { "resolution-mode": "require" };

declare module "vitest" {
  export interface ProvidedContext {
    MONGO_URI: string;
  }
}

type MongoMemoryServerOpts = Parameters<typeof MongoMemoryReplSet.create>[0];

// @ts-ignore
declare module "vitest/node" {
  export interface ResolvedConfig {
    // @ts-ignore
    vitestMms?: {
      mongodbMemoryServerOptions: MongoMemoryServerOpts;
    };
  }
}

export default async function setup({ provide, config }: TestProject) {
  const mongod = await MongoMemoryReplSet.create(
    config.vitestMms?.mongodbMemoryServerOptions,
  );

  const uri = mongod.getUri();

  provide("MONGO_URI", uri);

  return async () => {
    await mongod.stop();
  };
}
