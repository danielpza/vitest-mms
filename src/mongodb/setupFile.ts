import { Db, MongoClient } from "mongodb";
import { beforeEach } from "vitest";

import { setupDb } from "./helpers";

// hack to keep imported vitest types
export type { TestContext } from "vitest";

declare module "vitest" {
  interface TestContext {
    mongoClient: MongoClient;
    db: Db;
  }
}

const { db, mongoClient } = setupDb();

beforeEach(async (context) => {
  context.db = db;
  context.mongoClient = mongoClient;
});
