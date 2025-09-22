import { describe, expect, test } from "vitest";
import { insertUser } from "./index.js";
import { Schema } from "mongoose";
import { setupMongooseConnection } from "vitest-mms/mongoose/helpers";

const { connection } = setupMongooseConnection();

test("setupDb", async () => {
  expect(connection).toBeDefined();
});

test("check dbs are unique1", async () => {
  await insertUser(connection);
  await insertUser(connection);
  expect(await connection.db!.collection("users").countDocuments()).toBe(2);
});

test("check dbs are unique2", async () => {
  await insertUser(connection);
  expect(await connection.db!.collection("users").countDocuments()).toBe(1);
});

test("using mongoose schema", async () => {
  const Users = connection.model("User", new Schema({ name: String }));
  await Users.create({ name: "John" });
  expect(await Users.countDocuments()).toBe(1);
});

describe("performance", () => {
  for (let i = 0; i < 1000; i++)
    test(`test ${i}`, async () => {
      expect(true).toBe(true);
    });
});
