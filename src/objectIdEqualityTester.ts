import { ObjectId } from "mongodb";
import { expect } from "vitest";

expect.addEqualityTesters([
  // https://vitest.dev/api/expect.html#expect-addequalitytesters
  function objectIdEqualityTester(a: unknown, b: unknown) {
    if (a instanceof ObjectId && b instanceof ObjectId) return a.equals(b);
  },
]);
