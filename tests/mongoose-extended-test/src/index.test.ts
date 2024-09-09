import { describe, expect } from "vitest";
import { mmsTest as test } from "vitest-mms/mongoose/test";
import { insertUser } from "./index.js";
import { Schema } from "mongoose";

test("mmsTest", async ({ connection }) => {
  expect(connection).toBeDefined();
});

test("check dbs are unique1", async ({ connection }) => {
  await insertUser(connection);
  await insertUser(connection);
  expect(await connection.db!.collection("users").countDocuments()).toBe(2);
});

test("check dbs are unique2", async ({ connection }) => {
  await insertUser(connection);
  expect(await connection.db!.collection("users").countDocuments()).toBe(1);
});

test("using mongoose schema", async ({ connection }) => {
  const Users = connection.model("User", new Schema({ name: String }));
  await Users.create({ name: "John" });
  expect(await Users.countDocuments()).toBe(1);
});

describe("performance", () => {
  for (let i = 0; i < 1000; i++)
    test(`test ${i}`, async ({ connection: _connection }) => {
      expect(true).toBe(true);
    });
});
