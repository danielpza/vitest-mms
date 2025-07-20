# vitest-mms [![NPM Version](https://img.shields.io/npm/v/vitest-mms)](https://www.npmjs.com/package/vitest-mms)

[mongodb-memory-server](https://typegoose.github.io/mongodb-memory-server/) integration for [vitest](https://vitest.dev/)

<!-- prettier-ignore-start -->

<!--toc:start-->
- [Installation](#installation)
- [General Usage](#general-usage)
- [Usage with mongodb](#usage-with-mongodb)
  - [Manual Setup](#manual-setup)
  - [Using extended context](#using-extended-context)
- [Usage with mongoose](#usage-with-mongoose)
  - [Manual Setup (mongoose)](#manual-setup-mongoose)
  - [Using extended context (mongoose)](#using-extended-context-mongoose)
- [Using ReplSet](#using-replset)
<!--toc:end-->

<!-- prettier-ignore-end -->

## Installation

```shell
npm install -D vitest-mms mongodb-memory-server
yarn add -D vitest-mms mongodb-memory-server
pnpm add -D vitest-mms mongodb-memory-server
```

## General Usage

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

```js
// index.test.js
import { inject, test } from "vitest";

const MONGO_URI = inject("MONGO_URI");

test("some test", () => {
  // use mongodb/mongoose/other packages to connect to mongodb using MONGO_URI
});
```

## Usage with mongodb

> [!IMPORTANT]
> You need to install `mongodb` separately.

### Manual Setup

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

### Using extended context

See https://vitest.dev/guide/test-context.html#extend-test-context:

```js
// index.test.js
import { mssTest } from "vitest-mms/mongodb/test";

mssTest("another test", ({ db, mongoClient }) => {
  // rest of the test
});
```

- db is cleared after each test

## Usage with mongoose

> [!IMPORTANT]
> You need to install `mongoose` separately.

### Manual Setup (mongoose)

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

### Using extended context (mongoose)

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

export default defineConfig({
  test: {
    globalSetup: ["vitest-mms/globalSetupReplSet"],
    vitestMms: {
      mongodbMemoryServerOptions: {
        replSet: { count: 4 },
      },
    },
  },
});
```
