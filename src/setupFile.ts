import { MongoClient } from "mongodb";
import { afterAll, beforeAll, beforeEach, inject } from "vitest";

import type {} from "./globalSetup.js";

export const globalContext = Symbol("vitest-mms");

interface GlobalContext {
  mongoClient: MongoClient;
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

declare module "vitest" {
  interface TestContext {
    mongoClient: MongoClient;
  }
}

beforeEach(async (context) => {
  // @ts-expect-error How to defined a symbol in globalThis?
  Object.assign(context, globalThis[globalContext]);
});
