import { expect, test } from "vitest";

import { insertUser } from "./index.js";

test("mmsTest", async ({ mongoClient }) => {
  const db = mongoClient.db("test1");
  expect(mongoClient).toBeDefined();
});

test("check dbs are unique1", async ({ mongoClient }) => {
  const db = mongoClient.db("test2");
  await insertUser(db);
  await insertUser(db);
  expect(await db.collection("users").countDocuments()).toBe(2);
});

test("check dbs are unique2", async ({ mongoClient }) => {
  const db = mongoClient.db("test3");
  await insertUser(db);
  expect(await db.collection("users").countDocuments()).toBe(1);
});
