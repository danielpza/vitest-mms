import { type Connection, createConnection } from "mongoose";
import { afterAll, afterEach, beforeAll, beforeEach, inject } from "vitest";
// hack to keep imported vitest types
export type { TestContext } from "vitest";
// hack to fix pnpm build issue
export type {} from "../globalSetup.js";

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
});

afterAll(async () => {
  await connection.close();
});

beforeEach(async (context) => {
  context.connection = connection.useDb(randomUUID());
});

afterEach(async (context) => {
  await context.connection.db?.dropDatabase();
});
