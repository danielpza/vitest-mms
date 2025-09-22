import { randomUUID } from "node:crypto";

import { MongoClient } from "mongodb";
import { afterEach, beforeAll, inject } from "vitest";

export function setupDb() {
  const uri = inject("MONGO_URI");

  const mongoClient = new MongoClient(uri);
  const db = mongoClient.db(randomUUID());

  beforeAll(async () => {
    await mongoClient.connect();

    return async () => {
      await mongoClient.close();
    };
  });

  afterEach(async () => {
    await db.dropDatabase();
  });

  return { mongoClient, db };
}
