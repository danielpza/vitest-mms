import { expect } from "vitest";

test("mmsTest", async ({ db, mongoClient }) => {
  expect(mongoClient).toBeDefined();
  expect(db).toBeDefined();
});
