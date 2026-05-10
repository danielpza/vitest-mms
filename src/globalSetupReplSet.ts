import type { TestProject } from "vitest/node";

import { MongoMemoryReplSet } from "mongodb-memory-server";

export type { ProvidedContext } from "vitest";
export type { ResolvedConfig } from "vitest/node" with { "resolution-mode": "require" };

declare module "vitest" {
  export interface ProvidedContext {
    MONGO_URI: string;
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
