import { Socket } from "socket.io";
import { getMongoClient } from "../models/mongoClient";
import { verifyAuth } from "../utils/verifyAuth";
import { Db } from "mongodb";

export function onGetInfoUser(socket: Socket, SECRET_KEY: string) {
  socket.on("get_info_users", async (data: { users: string[] }) => {
    try {
      const auth = verifyAuth(socket, SECRET_KEY);
      if (!auth) return;

      const client = await getMongoClient();
      const db: Db = client.db("users");

      const result: Record<string, {}> = {};

      for (const userId of data.users) {
        const collection = db.collection<any>(userId);
        const config = await collection.findOne({ _id: "config" });

        if (config && config.avatar) {
          result[userId] = {
            avatar: config.avatar,
            name: config.name,
            desc: config.desc,
            id: config.id
          };
        }
      }

      socket.emit("get_info_users_return", {
        code: 1,
        users: result
      });

    } catch (error) {
      console.log("get_info_user error:", error);
      socket.emit("get_info_users_return", {
        code: 0,
        error: "server_error"
      });
    }
  });
}
