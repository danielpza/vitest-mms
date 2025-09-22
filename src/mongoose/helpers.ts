import { randomUUID } from "node:crypto";

import { afterEach, beforeAll, inject } from "vitest";
import { createConnection } from "mongoose";

export function setupMongooseConnection() {
  const uri = inject("MONGO_URI");

  const connection = createConnection(uri).useDb(randomUUID());

  beforeAll(async () => {
    await connection.asPromise();

    return async () => {
      await connection.close();
    };
  });

  afterEach(async () => {
    await connection.dropDatabase();
  });

  return { connection };
}
