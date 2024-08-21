import { Db, MongoClient } from "mongodb";
import type {} from "vitest";
import { afterAll, beforeAll, beforeEach, inject } from "vitest";

import type {} from "./globalSetup.js";
import { randomUUID } from "node:crypto";

export const globalContext = Symbol("vitest-mms");

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

  // @ts-expect-error How to defined a symbol in globalThis?
  globalThis[globalContext] = context;
});

afterAll(async () => {
  // @ts-expect-error How to defined a symbol in globalThis?
  const context = globalThis[globalContext] as GlobalContext;
  await context.mongoClient.close();
});

beforeEach(async (context) => {
  // @ts-expect-error How to defined a symbol in globalThis?
  const globalContext = globalThis[globalContext] as GlobalContext;
  const { mongoClient } = globalContext;
  const db = mongoClient.db(randomUUID());
  Object.assign(context, { mongoClient, db });
});
