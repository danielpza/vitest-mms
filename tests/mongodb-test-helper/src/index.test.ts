import { describe, expect, test } from "vitest";
import { setupDb } from "vitest-mms/mongodb/helpers";

import { insertUser } from "./index.js";

const { mongoClient, db } = setupDb();

test("setupDb", async () => {
  expect(mongoClient).toBeDefined();
  expect(db).toBeDefined();
});

test("check dbs are unique1", async () => {
  await insertUser(db);
  await insertUser(db);
  expect(await db.collection("users").countDocuments()).toBe(2);
});

test("check dbs are unique2", async () => {
  await insertUser(db);
  expect(await db.collection("users").countDocuments()).toBe(1);
});

// describe("performance", () => {
//   for (let i = 0; i < 1000; i++) {
//     test(`test ${i}`, async () => {
//       expect(true).toBe(true);
//     });
//   }
// });
