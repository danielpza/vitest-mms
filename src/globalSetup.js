import { MongoMemoryServer } from "mongodb-memory-server";

export default async function setup({ provide }) {
  const mongod = await MongoMemoryServer.create();

  const uri = mongod.getUri();

  provide("MONGO_URI", uri);

  return async () => {
    await mongod.stop();
  };
}
