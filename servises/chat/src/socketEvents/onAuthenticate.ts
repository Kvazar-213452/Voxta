import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { getMongoClient } from "../models/mongoClient";
import { Db } from "mongodb";

export function onAuthenticate(socket: Socket, SECRET_KEY: string) {
  socket.on("authenticate", async (data: { token: string }) => {
    try {
      const decoded = jwt.verify(data.token, SECRET_KEY) as { id_user: string };

      console.log(`user ${decoded.id_user} authenticated.`);
      socket.data.userId = decoded.id_user;
      socket.data.token = data.token;

      const client = await getMongoClient();
      const db: Db = client.db("users");
      const collection = db.collection<any>(decoded.id_user);

      const userConfig = await collection.findOne({ _id: 'config' });

      if (!userConfig) {
        socket.emit("authenticated", { code: 0 });
        socket.disconnect();
        return;
      }

      socket.emit("authenticated", {
        code: 1,
        user: transformUserData(userConfig)
      });

    } catch (error) {
      socket.emit("authenticated", { code: 0 });
      socket.disconnect();
    }
  });
}

function transformUserData(user: Record<string, any>): Record<string, any> {
  const newUser = { ...user };
  
  if ('id' in newUser) {
    newUser._id = newUser.id;
    delete newUser.id;
  }
  
  return newUser;
}