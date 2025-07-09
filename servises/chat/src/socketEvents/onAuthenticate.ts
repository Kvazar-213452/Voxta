import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { getMongoClient } from "../models/mongoClient";
import { Db } from "mongodb";

export function onAuthenticate(socket: Socket, SECRET_KEY: string): void {
  socket.on("authenticate", async (data: { token: string }) => {
    try {
      const decoded = jwt.verify(data.token, SECRET_KEY) as { id_user: string };

      console.log(`user ${decoded.id_user} authenticated.`);
      socket.data.userId = decoded.id_user;
      socket.data.token = data.token;

      const client = await getMongoClient();
      const db: Db = client.db("users");
      const collection = db.collection<any>(decoded.id_user);

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
