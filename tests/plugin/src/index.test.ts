import { expect, inject, test } from "vitest";

test("expect inject('MONGO_URI') to be defined", () => {
  expect(inject("MONGO_URI")).toBeDefined();
});
