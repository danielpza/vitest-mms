# vitest-mms

[![NPM Version](https://img.shields.io/npm/v/vitest-mms)](https://www.npmjs.com/package/vitest-mms)

[mongodb-memory-server](https://typegoose.github.io/mongodb-memory-server/) plugin for [vitest](https://vitest.dev/)

> [!WARN]
> This project is being reworked to support multiple mongodb backends (such as [testcontainers](https://testcontainers.com/modules/mongodb/?language=nodejs)), see [vitest-mongo](https://github.com/danielpza/vitest-mongo).

## Installation

```shell
npm install -D vitest-mms mongodb-memory-server
yarn add -D vitest-mms mongodb-memory-server
pnpm add -D vitest-mms mongodb-memory-server
```

## General Usage

### Setup

The main entrypoint is the `vitestMms` plugin. It extends the vitest context with the `MONGO_URI` value, which you can import with `inject`:

```js
// vitest.config.mjs
import { defineConfig } from "vitest/config";
import vitestMms from "vitest-mms";

export default defineConfig({
  plugins: [
    vitestMms({
      mongodbMemoryServerOptions: {
        /* optional mongodb-memory-server options */
      },
    }),
  ],
});
```

Then in your tests, use `inject("MONGO_URI")` to get the started server

```js
// index.test.js
import { inject } from "vitest";

const MONGO_URI = inject("MONGO_URI");

// use mongodb/mongoose/other packages to connect to mongodb using MONGO_URI
import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(MONGO_URI);
```

### MongoDB Example

```js
// index.test.js
import { inject, test } from "vitest";
import { MongoClient } from "mongodb";

const MONGO_URI = inject("MONGO_URI");
const mongoClient = new MongoClient(MONGO_URI);

beforeAll(async () => {
  await mongoClient.connect();
  return () => mongoClient.disconnect();
});

test("some test", async () => {
  const db = mongoClient.db("my-db");
  // rest of the test
});
```

### Mongoose Example

```js
// index.test.js
import { inject, test } from "vitest";
import { createConnection } from "mongoose";

const MONGO_URI = inject("MONGO_URI");
let connection;

beforeAll(async () => {
  connection = await createConnection(MONGO_URI).asPromise();
  return () => connection.close();
});

test("some test", async () => {
  const dbConnection = connection.useDb("my-db");
  // rest of the test
});
```

## Additional helpers

This plugin exports additional entrypoints to help setup tests and cleanup. These are optional.

### Mongodb

> [!IMPORTANT]
> You need to install `mongodb` separately.

#### Using setup test helper

```js
// index.test.js
import { setupDb } from "vitest-mms/mongodb/helpers";

// db is cleared after each test
// mongoClient is disconnected after all tests are done
const { db, mongoClient } = setupDb();

test("some test", async () => {
  // rest of the test
});
```

#### Using extended context

See https://vitest.dev/guide/test-context.html#extend-test-context:

```js
// index.test.js
import { mssTest } from "vitest-mms/mongodb/test";

mssTest("another test", ({ db, mongoClient }) => {
  // rest of the test
});
```

- db is cleared after each test

### Mongoose

> [!IMPORTANT]
> You need to install `mongoose` separately.

#### Using setup test helper (mongoose)

```js
// index.test.js
import { test } from "vitest";
import { setupMongooseConnection } from "vitest-mms/mongoose/helpers";

// provides default db connection
// db will be dropped after each test
// connection will be closed after all tests
const { connection } = setupMongooseConnection();

test("some test", async () => {
  // rest of the test
});
```

#### Using extended context (mongoose)

```js
import { mssTest } from "vitest-mms/mongoose/test";

// index.test.js
test("my test", async ({ connection }) => {
  const User = connection.model("User", new Schema({ name: String }));
  await User.create({ name: "John" });
  expect(await User.countDocuments()).toBe(1);
});
```

- `connection` is the `Connection` instance returned by `mongoose.createConnection` scoped to a db. See https://mongoosejs.com/docs/api/connection.html

## Using ReplSet

See https://typegoose.github.io/mongodb-memory-server/docs/guides/quick-start-guide#replicaset

```js
// vitest.config.mjs
import { defineConfig } from "vitest/config";
import vitestMms from "vitest-mms";

export default defineConfig({
  plugins: [
    vitestMms({
      server: "replset",
      mongodbMemoryServerOptions: {
        replSet: { count: 4 },
      },
    }),
  ],
});
```

## Legacy exports

The following entrypoint are only available as legacy code and will be removed in future version

### Manual Setup

This is deprecated in favor of using the plugin

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["vitest-mms/globalSetup"]
  }
}
```

```js
// vitest.config.mjs
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: ["vitest-mms/globalSetup"],
  },
});
```

### Legacy setup files

> [!WARNING]
> Although convenient, these helpers have been deprecated since they rely on vitest [beforeEach/afterEach](https://vitest.dev/guide/test-context.html#beforeeach-and-aftereach) hooks which are marked as deprecated by vitest

```js
// vitest.config.mjs
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: ["vitest-mms/globalSetup"],
    setupFiles: ["vitest-mms/mongodb/setupFile"], // or vitest-mms/mongoose/setupFile
  },
});
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": [
      "vitest-mms/globalSetup",
      // or "vitest-mms/mongoose/setupFile"
      "vitest-mms/mongodb/setupFile"
    ]
  }
}
```

```js
import { test, expect } from "vitest";

test("my test", async ({ db, mongoClient }) => {
  const users = db.collection("users");
  users.insertOne({ name: "John" });
  expect(await users.countDocuments()).toBe(1);
});

// or with mongoose
// test("my test", async ({connection }) => { ... })
```

- database is cleared before each test
