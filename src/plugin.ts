import type { MongoMemoryServer } from "mongodb-memory-server";

import type {} from "./globalSetup.ts";

type MongoMemoryServerOpts = Parameters<typeof MongoMemoryServer.create>[0];

declare module "vitest/node" {
  export interface ResolvedConfig {
    vitestMms?: {
      mongodbMemoryServerOptions?: MongoMemoryServerOpts;
    };
  }
}

export default function vitestMms(opts?: {
  server?: "default" | "replset";
  mongodbMemoryServerOptions?: MongoMemoryServerOpts;
}) {
  return {
    name: "vitest-mms",
    config: () => ({
      vitestMms: opts,
      test: {
        globalSetup: [
          opts?.server === "replset"
            ? "vitest-mms/globalSetupReplSet"
            : "vitest-mms/globalSetup",
        ],
      },
    }),
  };
}
