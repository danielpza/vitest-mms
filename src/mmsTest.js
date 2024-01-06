import { randomUUID } from "node:crypto";

import { MongoClient } from "mongodb";
import { inject, test } from "vitest";

export const mmsTest = test.extend({
  mongoClient: async ({}, use) => {
    const uri = inject("MONGO_URI");
    const client = new MongoClient(uri, {
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
