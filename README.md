# vitest-mms [![NPM Version](https://img.shields.io/npm/v/vitest-mms)](https://www.npmjs.com/package/vitest-mms)

[mongodb-memory-server](https://nodkz.github.io/mongodb-memory-server/) integration for [vitest](https://vitest.dev/)

## Installation

```shell
npm install -D vitest-mms mongodb-memory-server
yarn add -D vitest-mms mongodb-memory-server
pnpm add -D vitest-mms mongodb-memory-server
```

## Usage

### Extending the global context

vitest.config.mjs:

```js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: ["vitest-mms/globalSetup"],
    setupFiles: ["vitest-mms/setupFile"],
  },
});
```

index.test.js:

```js
// using the extended test context
import { test } from "vitest";

test("my test", async ({ db, mongoClient }) => {
  const users = db.collection("users");
  users.insertOne({ name: "John" });
  expect(await users.countDocuments()).toBe(1);
});
```

- `mongoClient` is the connected MongoClient instance (see `import("mongodb").MongoClient`)
- `db` is a random database name connected to the mongodb-memory-server instance (see `import("mongodb").Db`)

### Extending locally with test.extend

vitest.config.mjs:

```js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: ["vitest-mms/globalSetup"],
  },
});
```

index.test.js:

```js
// using the extended test context
import { mssTest as test } from "vitest-mms/test";

test("my test", async ({ db, mongoClient }) => {
  const users = db.collection("users");
  users.insertOne({ name: "John" });
  expect(await users.countDocuments()).toBe(1);
});
```

- `mongoClient` is the connected MongoClient instance (see `import("mongodb").MongoClient`)
- `db` is a random database name connected to the mongodb-memory-server instance (see `import("mongodb").Db`)

#### Usage with [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import)

vitest.config.mjs:

```js
import { defineConfig } from "vitest/config";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  plugins: [
    AutoImport({
      imports: [{ "vitest-mms/test": [["mmsTest", "test"]] }],
    }),
  ],
  test: {
    globalSetup: ["vitest-mms/globalSetup"],
  },
});
```

Then just use it directly:

```js
// index.test.js
test("my test", async ({ db, mongoClient }) => {
  const users = db.collection("users");
  users.insertOne({ name: "John" });
  expect(await users.countDocuments()).toBe(1);
});
```
