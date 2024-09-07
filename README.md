# vitest-mms [![NPM Version](https://img.shields.io/npm/v/vitest-mms)](https://www.npmjs.com/package/vitest-mms)

[mongodb-memory-server](https://nodkz.github.io/mongodb-memory-server/) integration for [vitest](https://vitest.dev/)

## Installation

```shell
npm install -D vitest-mms mongodb-memory-server
yarn add -D vitest-mms mongodb-memory-server
pnpm add -D vitest-mms mongodb-memory-server
```

## Usage

Setup:

Add `vitest-mms/globalSetup` to globalSetup in your vitest config

```js
// vitest.config.mjs
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: ["vitest-mms/globalSetup"],
  },
});
```

### Extending the global context

To make it available in the global context for every test you also need to add the `vitest-mms/setupFile` to your vitest config

```js
// vitest.config.mjs
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: ["vitest-mms/globalSetup"],
    setupFiles: ["vitest-mms/setupFile"],
  },
});
```

This will make it available in the tests context globally

```js
// index.test.js
import { test } from "vitest";

test("my test", async ({ db, mongoClient }) => {
  const users = db.collection("users");
  users.insertOne({ name: "John" });
  expect(await users.countDocuments()).toBe(1);
});
```

- `mongoClient` is the connected MongoClient instance (see `import("mongodb").MongoClient`)
- `db` is a random database name connected to the mongodb-memory-server instance (see `import("mongodb").Db`)

For typescript support add the following to your tsconfig.json

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["vitest-mms/setupFile"]
  }
}
```

### Alternative extending locally with test.extend

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

See https://vitest.dev/guide/test-context.html#extend-test-context for more information

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

Then use it directly without having to import `mmsTest`:

```js
// index.test.js
test("my test", async ({ db, mongoClient }) => {
  const users = db.collection("users");
  users.insertOne({ name: "John" });
  expect(await users.countDocuments()).toBe(1);
});
```

## Usage with mongoose

```js
// vitest.config.mjs
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: ["vitest-mms/globalSetup"],
    setupFile: ["vitest-mms/mongoose/setupFile"],
  },
});
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["vitest-mms/mongoose/setupFile"]
  }
}
```

```js
// index.test.js
test("my test", async ({ mongoose }) => {
  mongoose.connection.db; // use db

  const User = mongoose.model("User", new mongoose.Schema({ name: String }));
  await User.create({ name: "John" });
  expect(await User.countDocuments()).toBe(1);
});
```
