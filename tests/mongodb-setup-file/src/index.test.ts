import { describe, expect, test } from "vitest";

import { insertUser } from "./index.js";

test("mmsTest", async ({ mongoClient, db }) => {
  expect(mongoClient).toBeDefined();
  expect(db).toBeDefined();
});

test("check dbs are unique1", async ({ db }) => {
  await insertUser(db);
  await insertUser(db);
  expect(await db.collection("users").countDocuments()).toBe(2);
});

test("check dbs are unique2", async ({ db }) => {
  await insertUser(db);
  expect(await db.collection("users").countDocuments()).toBe(1);
});

describe("performance", () => {
  test.each(Array.from({ length: 1000 }, (_, i) => i))("test %i", async () => {
    expect(true).toBe(true);
  });
});
