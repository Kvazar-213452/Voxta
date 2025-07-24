import { Socket } from "socket.io";
import { getMongoClient } from "../../models/mongoClient";
import { Db } from "mongodb";
import { verifyAuth } from "../../utils/verifyAuth";

export function onAddFriend(socket: Socket): void {
  socket.on("add_friend", async (data: { id: string }) => {
    if (!verifyAuth(socket)) return;

    try {
      const db: Db = (await getMongoClient()).db("users");
      const collection = db.collection<any>(socket.data.userId);

      const config = await collection.findOne({ _id: "config" });
      if (!config) return socket.emit("add_friends", { code: 0 });

      const friends: string[] = config.friends || [];
      let id: string = String(data.id);

      if (!friends.includes(id)) {
        friends.push(id);
        await collection.updateOne({ _id: "config" }, { $set: { friends } });
      }

      socket.emit("add_friends", { code: 1 });

    } catch (e) {
      socket.emit("add_friends", { code: 0 });
    }
  });
}
