import { Socket } from "socket.io";
import { getMongoClient } from "../models/mongoClient";
import { Db } from "mongodb";
import { verifyAuth } from "../utils/verifyAuth";
import { uploadAvatar } from "../utils/uploadData";

export function onSaveSettingsChat(socket: Socket, SECRET_KEY: string): void {
  socket.on("save_settings_chat", async (data: { id: string, dataChat: any }) => {
    try {
      const auth = verifyAuth(socket, SECRET_KEY);
      if (!auth) return;

      const client = await getMongoClient();
      const db: Db = client.db("chats");
      const collection = db.collection<any>(data.id);

      const update: any = {
        name: data.dataChat.name,
        desc: data.dataChat.desc,
      };

      if (data.dataChat.avatar !== null) {
        const avatarUrl = await uploadAvatar(data.dataChat.avatar);
        update.avatar = avatarUrl;
      }

      const result = await collection.updateOne(
        { _id: "config" },
        { $set: update }
      );

      if (result.modifiedCount === 0) {
        socket.emit("save_settings_chat", { code: 0 });
        return;
      }

      socket.emit("save_settings_chat", { code: 1 });

    } catch (error) {
      console.error("Error saving chat settings:", error);
      socket.emit("save_settings_chat", { code: 0 });
    }
  });
}
