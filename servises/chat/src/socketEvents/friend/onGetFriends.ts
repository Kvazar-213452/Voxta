import { Socket } from "socket.io";
import { getMongoClient } from "../../models/mongoClient";
import { Db } from "mongodb";
import { verifyAuth } from "../../utils/verifyAuth";

export function onGetFriends(socket: Socket): void {
  socket.on("get_friends", async (data: {type: string}) => {
    try {
      const auth = verifyAuth(socket);
      if (!auth) return;

      const client = await getMongoClient();
      const db: Db = client.db("users");
      const collection = db.collection<any>(socket.data.userId);

      let userConfig = await collection.findOne({ _id: 'config' });

      if (!userConfig) {
        socket.emit("get_friends", { code: 0 });
        socket.disconnect();
        return;
      }

      socket.emit("get_friends", {
        code: 1,
        friends: userConfig.friends,
        type: data.type
      });

    } catch (error) {
      socket.emit("get_friends", { code: 0 });
      socket.disconnect();
    }
  });
}
