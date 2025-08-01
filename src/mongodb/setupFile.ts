import { Db, MongoClient } from "mongodb";
import { beforeAll, beforeEach, inject } from "vitest";
// hack to keep imported vitest types
export type { TestContext } from "vitest";

import { randomUUID } from "node:crypto";

declare module "vitest" {
  interface TestContext {
    mongoClient: MongoClient;
    db: Db;
  }
}

let mongoClient: MongoClient;

beforeAll(async () => {
  const uri = inject("MONGO_URI");

  mongoClient = new MongoClient(uri);
  await mongoClient.connect();

  return async () => {
    await mongoClient.close();
  };
});

beforeEach(async (context) => {
  const db = mongoClient.db(randomUUID());
  context.db = db;
  context.mongoClient = mongoClient;
  return async () => {
    await context.db.dropDatabase();
  };
});
