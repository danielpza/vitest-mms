import { randomUUID } from "node:crypto";

import { type Db, MongoClient } from "mongodb";
import { inject, test } from "vitest";

export const mmsTest = test.extend<{
  mongoClient: MongoClient;
  db: Db;
}>({
  mongoClient: async ({}, use) => {
    // @ts-expect-error
    const uri = inject("MONGO_URI");
    const client = new MongoClient(uri, {
      // @ts-expect-error
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    await use(client);
    await client.close();
  },
  db: async ({ mongoClient }, use) => {
    await use(mongoClient.db(randomUUID()));
  },
});
