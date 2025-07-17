import { Socket } from "socket.io";
import { getMongoClient } from "../models/mongoClient";
import { Db } from "mongodb";
import { verifyAuth } from "../utils/verifyAuth";

export function onFindFriend(socket: Socket, SECRET_KEY: string): void {
  socket.on("find_friend", async (data: { name: string }) => {
    try {
      const auth = verifyAuth(socket, SECRET_KEY);
      if (!auth) return;

      const client = await getMongoClient();
      const db: Db = client.db("users");

      const collections = await db.listCollections().toArray();
      const matchedUserIds: string[] = [];

      for (const col of collections) {
        const colName = col.name;
        const collection = db.collection<any>(colName);
        const configDoc = await collection.findOne({ _id: "config" });

        if (configDoc && configDoc.name && typeof configDoc.name === "string") {
          if (configDoc.name.toLowerCase().includes(data.name.toLowerCase())) {
            matchedUserIds.push(colName);
          }
        }

        if (matchedUserIds.length >= 10) break;
      }

      socket.emit("find_friend", {
        code: 1,
        users: matchedUserIds
      });

    } catch (error) {
      console.error("Error in find_friend:", error);
      socket.emit("find_friend", { code: 0 });
    }
  });
}
