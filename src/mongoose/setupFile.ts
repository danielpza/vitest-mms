import { type Connection, createConnection } from "mongoose";
import { beforeAll, beforeEach, inject } from "vitest";
// hack to keep imported vitest types
export type { TestContext } from "vitest";

import { randomUUID } from "node:crypto";

declare module "vitest" {
  interface TestContext {
    connection: Connection;
  }
}

let connection: Connection;

beforeAll(async () => {
  const uri = inject("MONGO_URI");
  connection = await createConnection(uri).asPromise();
  return async () => {
    await connection.close();
  };
});

beforeEach(async (context) => {
  context.connection = connection.useDb(randomUUID());
  return async () => {
    await context.connection.db?.dropDatabase();
  };
});
