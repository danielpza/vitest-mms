import { Db, MongoClient } from "mongodb";
import { afterAll, beforeAll, beforeEach, inject } from "vitest";
// hack to keep imported vitest types
export type { TestContext } from "vitest";

import { randomUUID } from "node:crypto";

export const globalContextSymbol = Symbol("vitest-mms");

interface GlobalContext {
  mongoClient: MongoClient;
}

declare module "vitest" {
  interface TestContext {
    mongoClient: MongoClient;
    db: Db;
  }
}

beforeAll(async () => {
  const uri = inject("MONGO_URI");

  const mongoClient = new MongoClient(uri);
  await mongoClient.connect();

  const context: GlobalContext = {
    mongoClient: mongoClient,
  };

  globalThis[globalContextSymbol] = context;
});

afterAll(async () => {
  const context = globalThis[globalContextSymbol] as GlobalContext;
  await context.mongoClient.close();
});

beforeEach(async (context) => {
  const globalContext = globalThis[globalContextSymbol] as GlobalContext;
  const { mongoClient } = globalContext;
  const db = mongoClient.db(randomUUID());
  Object.assign(context, { mongoClient, db });
});
