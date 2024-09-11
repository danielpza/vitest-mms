import { type Connection, createConnection } from "mongoose";
import { afterAll, afterEach, beforeAll, beforeEach, inject } from "vitest";

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
