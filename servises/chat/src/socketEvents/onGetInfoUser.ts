import { Socket } from "socket.io";
import { getMongoClient } from "../models/mongoClient";
import { verifyAuth } from "../utils/verifyAuth";
import { Db } from "mongodb";

export function onGetInfoUser(socket: Socket, SECRET_KEY: string): void {
  socket.on("get_info_user", async (data: { userId: string, type: string }) => {
    try {
      const auth = verifyAuth(socket, SECRET_KEY);
      if (!auth) return;

      const client = await getMongoClient();
      const db: Db = client.db("users");
      const collection = db.collection<any>(data.userId);

      const userConfig = await collection.findOne({ _id: 'config' });

      if (!userConfig) {
        socket.emit(data.type, { code: 0 });
        return;
      }

      socket.emit(data.type, {
        code: 1,
        user: transformUserData(userConfig)
      });

    } catch (error) {
      socket.emit(data.type, {
        code: 0,
        error: "server_error"
      });
    }
  });
}

function transformUserData(user: Record<string, any>): Record<string, any> {
  return {
    avatar: user.avatar,
    desc: user.desc,
    name: user.name,
    id: user.id,
    time: user.time
  };
}
