import { Db, MongoClient } from "mongodb";
import { afterAll, afterEach, beforeAll, beforeEach, inject } from "vitest";
// hack to keep imported vitest types
export type { TestContext } from "vitest";
// hack to fix pnpm build issue
export type {} from "../globalSetup.js";

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
});

afterAll(async () => {
  await mongoClient.close();
});

beforeEach(async (context) => {
  const db = mongoClient.db(randomUUID());
  context.db = db;
  context.mongoClient = mongoClient;
});

afterEach(async (context) => {
  await context.db.dropDatabase();
});
