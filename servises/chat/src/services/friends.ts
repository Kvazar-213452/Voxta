import { getMongoClient } from "../models/mongoClient";
import axios from "axios";

export async function authenticateFriends(): Promise<void> {
  try {
    const client = await getMongoClient();
    const db = client.db("users");

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    await axios.post("http://localhost:3007/authenticate", {
      users: collectionNames,
    });

  } catch (err) {
    console.error("Error:", err);
  }
}

export async function getUserCode(code: string): Promise<any> {
  try {
    const response = await axios.post("http://localhost:3007/get_id_via_code", {
      code: code,
    });

    return response;
  } catch (err) {
    console.error("Error:", err);
    return "";
  }
}
