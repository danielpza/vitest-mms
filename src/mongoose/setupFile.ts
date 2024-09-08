import mongoose, { type Mongoose } from "mongoose";
import { afterEach, beforeEach, inject } from "vitest";
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

beforeEach(async (context) => {
  const uri = inject("MONGO_URI");

  const mongooseClient = await mongoose.connect(uri, { dbName: randomUUID() });
  Object.assign(context, { mongoose: mongooseClient });
});

afterEach(async (context) => {
  await context.mongoose.connection.db?.dropDatabase();
  await context.mongoose.disconnect();
});
