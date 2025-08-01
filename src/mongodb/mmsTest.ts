import { randomUUID } from "node:crypto";

import { type Db, MongoClient } from "mongodb";
import { afterAll, inject, test } from "vitest";

export type { ProvidedContext } from "../globalSetup.js";

let client: MongoClient | undefined;

afterAll(async () => {
  if (client) {
    await client.close();
  }
});

export const mmsTest = test.extend<{
  mongoClient: MongoClient;
  db: Db;
}>({
  mongoClient: async ({}, use) => {
    if (!client) {
      // reuse client if exist to avoid connecting on each test
      const uri = inject("MONGO_URI");
      client = new MongoClient(uri);
      await client.connect();
    }
    await use(client);
  },
  db: async ({ mongoClient }, use) => {
    const db = mongoClient.db(randomUUID());
    await use(db);
    await db.dropDatabase();
  },
});
