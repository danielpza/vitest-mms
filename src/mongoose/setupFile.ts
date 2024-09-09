import mongoose, { type Mongoose } from "mongoose";
import { afterAll, afterEach, beforeAll, beforeEach, inject } from "vitest";
// hack to keep imported vitest types
export type { TestContext } from "vitest";
// hack to fix pnpm build issue
export type {} from "../globalSetup.js";

import { randomUUID } from "node:crypto";

declare module "vitest" {
  interface TestContext {
    mongoose: Mongoose;
  }
}

let mongooseClient: Mongoose;

beforeAll(async () => {
  const uri = inject("MONGO_URI");
  mongooseClient = await mongoose.connect(uri);
});

afterAll(async () => {
  await mongooseClient.disconnect();
});

beforeEach(async (context) => {
  const dbName = randomUUID();
  mongooseClient.connection.useDb(dbName);
  context.mongoose = mongooseClient;
});

afterEach(async (context) => {
  await context.mongoose.connection.db?.dropDatabase();
});
