import { Db, MongoClient } from "mongodb";
import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, inject } from "vitest";

declare module "vitest" {
  export interface TestContext {
    mongoClient: MongoClient;
    db: Db;
  }
}

beforeEach(async (context) => {
  const uri = inject("MONGO_URI");

  const mongoClient = new MongoClient(uri);
  await mongoClient.connect();

  context.mongoClient = mongoClient;
  context.db = mongoClient.db(randomUUID());
});

afterEach(async (context) => {
  await context.mongoClient.close();
});
