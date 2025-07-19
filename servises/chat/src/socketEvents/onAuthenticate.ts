import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { getMongoClient } from "../models/mongoClient";
import { addServer } from "../utils/serverChats";
import { Db } from "mongodb";

export function onAuthenticate(socket: Socket, SECRET_KEY: string): void {
  socket.on("authenticate", async (data: { token: string, chats }) => {
    try {
      if (data.token === 'server') {
        addServer(socket.id, data.chats);
        socket.emit("authenticated", { code: 1, id: socket.id});
        return
      }

      const decoded = jwt.verify(data.token, SECRET_KEY) as { userId: string };

      console.log(`user ${decoded.userId} authenticated.`);
      socket.data.userId = decoded.userId;
      socket.data.token = data.token;

      const client = await getMongoClient();
      const db: Db = client.db("users");
      const collection = db.collection<any>(decoded.userId);

      let userConfig = await collection.findOne({ _id: 'config' });
      userConfig._id = userConfig.id;
      delete userConfig.id;

      if (!userConfig) {
        socket.emit("authenticated", { code: 0 });
        socket.disconnect();
        return;
      }

      socket.emit("authenticated", {
        code: 1,
        user: transforUser(userConfig)
      });

    } catch (error) {
      socket.emit("authenticated", { code: 0 });
      socket.disconnect();
    }
  });
}

function transforUser(user: Record<string, any>): Record<string, any> {
  return {
    id: user._id,
    name: user.name,
    password: user.password,
    time: user.time,
    avatar: user.avatar,
    desc: user.desc,
    chats: user.chats
  };
}
