import { Connection } from "mongoose";

export async function insertUser(connection: Connection) {
  await connection.db!.collection("users").insertOne({ name: "John" });
}
