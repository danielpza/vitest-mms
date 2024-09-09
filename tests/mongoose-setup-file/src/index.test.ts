import { expect } from "vitest";
import { insertUser } from "./index.js";

test("mmsTest", async ({ mongoose }) => {
  expect(mongoose).toBeDefined();
});

test("check dbs are unique1", async ({ mongoose }) => {
  await insertUser(mongoose);
  await insertUser(mongoose);
  expect(
    await mongoose.connection.db!.collection("users").countDocuments(),
  ).toBe(2);
});

test("check dbs are unique2", async ({ mongoose }) => {
  await insertUser(mongoose);
  expect(
    await mongoose.connection.db!.collection("users").countDocuments(),
  ).toBe(1);
});

test("using mongoose schema", async ({ mongoose }) => {
  const Users = mongoose.model("User", new mongoose.Schema({ name: String }));
  await Users.create({ name: "John" });
  expect(await Users.countDocuments()).toBe(1);
});

describe("performance", () => {
  test.each(Array.from({ length: 1000 }, (_, i) => i))("test %i", async () => {
    expect(true).toBe(true);
  });
});
