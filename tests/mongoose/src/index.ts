import { Mongoose } from "mongoose";

export async function insertUser(mongooseClient: Mongoose) {
  await mongooseClient.connection
    .db!.collection("users")
    .insertOne({ name: "John" });
}
