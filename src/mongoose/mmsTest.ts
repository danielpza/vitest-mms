import { randomUUID } from "node:crypto";

import { afterAll, inject, test } from "vitest";
import { type Connection, createConnection } from "mongoose";

export type { ProvidedContext } from "../globalSetup.js";

let connection: Connection | undefined;

afterAll(async () => {
  if (connection) {
    await connection.close();
  }
});

export const mmsTest = test.extend<{
  connection: Connection;
}>({
  connection: async ({}, use) => {
    if (!connection) {
      const uri = inject("MONGO_URI");
      connection = await createConnection(uri).asPromise();
    }
    await use(connection.useDb(randomUUID()));
  },
});
