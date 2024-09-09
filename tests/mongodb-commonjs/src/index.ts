import { Db } from "mongodb";

export async function insertUser(db: Db) {
  await db.collection("users").insertOne({ name: "John" });
}
