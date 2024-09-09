import { describe, expect } from "vitest";
import { mmsTest } from "vitest-mms/mongodb/test";

import { insertUser } from "./index.js";

mmsTest("mmsTest", async ({ mongoClient, db }) => {
  expect(mongoClient).toBeDefined();
  expect(db).toBeDefined();
});

mmsTest("check dbs are unique1", async ({ db }) => {
  await insertUser(db);
  await insertUser(db);
  expect(await db.collection("users").countDocuments()).toBe(2);
});

mmsTest("check dbs are unique2", async ({ db }) => {
  await insertUser(db);
  expect(await db.collection("users").countDocuments()).toBe(1);
});

describe("performance", () => {
  for (let i = 0; i < 1000; i++) {
    mmsTest(`test ${i}`, async ({ db: _db }) => {
      expect(true).toBe(true);
    });
  }
});
