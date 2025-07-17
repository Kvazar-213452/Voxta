import { Socket } from "socket.io";
import { getMongoClient } from "../models/mongoClient";
import { Db } from "mongodb";
import { verifyAuth } from "../utils/verifyAuth";

export function onDelFriend(socket: Socket, SECRET_KEY: string): void {
  socket.on("del_friend", async (data: { id: string }) => {
    try {
      const auth = verifyAuth(socket, SECRET_KEY);
      if (!auth) return;

      const client = await getMongoClient();
      const db: Db = client.db("users");
      const collection = db.collection<any>(socket.data.userId);

      const userConfig = await collection.findOne({ _id: 'config' });

      if (!userConfig || !Array.isArray(userConfig.friends)) {
        socket.emit("del_friend", { code: 0 });
        socket.disconnect();
        return;
      }

      const updatedFriends = userConfig.friends.filter((friendId: any) => String(friendId) !== String(data.id));

      await collection.updateOne(
        { _id: 'config' },
        { $set: { friends: updatedFriends } }
      );

      socket.emit("del_friend", {
        code: 1,
        friends: updatedFriends
      });

    } catch (error) {
      console.error("del_friend error:", error);
      socket.emit("del_friend", { code: 0 });
      socket.disconnect();
    }
  });
}
