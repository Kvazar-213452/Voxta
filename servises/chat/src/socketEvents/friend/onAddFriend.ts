import { getMongoClient } from "../../models/mongoClient";
import { Code, Db } from "mongodb";
import { Socket } from "socket.io";
import { getUserCode } from "../../services/friends";
import { verifyAuth } from "../../utils/verifyAuth";

export function onAddFriend(socket: Socket): void {
  socket.on("add_friend", async (data: { code: string }) => {
    if (!verifyAuth(socket)) return;

    try {
      let res = await getUserCode(data.code);

      if (res.code) {
        socket.emit("add_friends", { code: 0 });
      } else {
        console.log(res.data.idUser)
        const db: Db = (await getMongoClient()).db("users");
        const collection = db.collection<any>(socket.data.userId);

        const config = await collection.findOne({ _id: "config" });
        if (!config) return socket.emit("add_friends", { code: 0 });

        const friends: string[] = config.friends || [];
        let id: string = String(res.data.idUser);

        if (!friends.includes(id)) {
          friends.push(id);
          await collection.updateOne({ _id: "config" }, { $set: { friends } });
        }

        socket.emit("add_friends", { code: 1 });
      }
      
    } catch (e) {
      socket.emit("add_friends", { code: 0 });
    }
  });
}
