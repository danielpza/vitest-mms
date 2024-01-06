import type { Db, MongoClient } from "mongodb";
import type { TestAPI } from "vitest";

export const mmsTest: TestAPI<{
  mongoClient: MongoClient;
  db: Db;
}>;
