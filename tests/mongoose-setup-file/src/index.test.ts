import { expect } from "vitest";
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
  test.each(Array.from({ length: 1000 }, (_, i) => i))("test %i", async () => {
    expect(true).toBe(true);
  });
});
