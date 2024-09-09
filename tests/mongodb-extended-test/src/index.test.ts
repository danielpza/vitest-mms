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
  mmsTest.each(Array.from({ length: 1000 }, (_, i) => i))(
    "test %i",
    async () => {
      expect(true).toBe(true);
    },
  );
});
