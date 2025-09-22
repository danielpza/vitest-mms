import { type Connection } from "mongoose";
import { beforeEach } from "vitest";

import { setupMongooseConnection } from "./helpers";

// hack to keep imported vitest types
export type { TestContext } from "vitest";

declare module "vitest" {
  interface TestContext {
    connection: Connection;
  }
}

const { connection } = setupMongooseConnection();

beforeEach(async (context) => {
  context.connection = connection;
});
