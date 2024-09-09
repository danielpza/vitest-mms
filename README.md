# vitest-mms [![NPM Version](https://img.shields.io/npm/v/vitest-mms)](https://www.npmjs.com/package/vitest-mms)

[mongodb-memory-server](https://typegoose.github.io/mongodb-memory-server/) integration for [vitest](https://vitest.dev/)

- [`mongodb`](#usage-with-mongodb) driver support.
- [`mongoose`](#usage-with-mongoose) support.
- clear database between each test
- ootb ready to start writting tests

If you need support for other ORMs, please open an issue or a pull request. See [./tests](./tests) for more examples.

> [!TIP]
> You can also connect to the mongodb memory server directly by using a connection uri `const connectionUri = inject("MONGO_URI");`

## Installation

```shell
npm install -D vitest-mms mongodb-memory-server
yarn add -D vitest-mms mongodb-memory-server
pnpm add -D vitest-mms mongodb-memory-server
```

## Usage with mongodb

> [!IMPORTANT]
> You need to install `mongodb` separately.

To make it available in the global context for every test you need to add a globalSetup and setupFile in your vitest config:

`vitest.config.mjs`:

```js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: ["vitest-mms/globalSetup"],
    setupFiles: ["vitest-mms/mongodb/setupFile"],
  },
});
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vitest-mms/mongodb/setupFile"]
  }
}
```

`index.test.js`:

```js
import { test } from "vitest";

test("my test", async ({ db, mongoClient }) => {
  const users = db.collection("users");
  users.insertOne({ name: "John" });
  expect(await users.countDocuments()).toBe(1);
});
```

- `mongoClient` is the connected MongoClient instance (see `import("mongodb").MongoClient`)
- `db` is a random database name connected to the mongodb-memory-server instance (see `import("mongodb").Db`)

## Usage with mongoose

> [!IMPORTANT]
> You need to install `mongoose` separately.

`vitest.config.mjs`:

```js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: ["vitest-mms/globalSetup"],
    setupFile: ["vitest-mms/mongoose/setupFile"],
  },
});
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vitest-mms/mongoose/setupFile"]
  }
}
```

`index.test.js`:

```js
test("my test", async ({ mongoose }) => {
  mongoose.connection.db; // use db

  const User = mongoose.model("User", new mongoose.Schema({ name: String }));
  await User.create({ name: "John" });
  expect(await User.countDocuments()).toBe(1);
});
```

- `mongoose` is the mongoose instance returned by `mongoose.connect`

## Alternative using a extended test context

If you want to avoid the overhead of vitest-mms on every test and instead just want to use it for a subset of your tests, you can use `vitest-mms/*/test` instead:

`vitest.config.mjs`:

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
import { mssTest } from "vitest-mms/mongodb/test";

mssTest("my test", async ({ db, mongoClient }) => {
  const users = db.collection("users");
  users.insertOne({ name: "John" });
  expect(await users.countDocuments()).toBe(1);
});
```

See https://vitest.dev/guide/test-context.html#extend-test-context for more information
