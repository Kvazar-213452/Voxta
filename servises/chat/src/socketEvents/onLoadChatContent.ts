import { Socket } from "socket.io";
import { getMongoClient } from "../models/mongoClient";
import { verifyAuth } from "../utils/verifyAuth";
import { Db } from "mongodb";

export function onLoadChatContent(socket: Socket, SECRET_KEY: string): void {
  socket.on("load_chat_content", async (data: { chatId: string, type: string }) => {
    try {
      const auth = verifyAuth(socket, SECRET_KEY);
      if (!auth) return;

      const client = await getMongoClient();
      const db: Db = client.db("chats");

      const collection = db.collection<any>(data.chatId);

      const config = await collection.findOne({ _id: "config" });
      if (!config) {
        throw new Error("Config not found");
      }

      const participants: string[] = config.participants || [];
      const participantsData: Record<string, { avatar: string; name: string }> = {};
      const usersDb: Db = client.db("users");

      for (const participantId of participants) {
        const userCollection = usersDb.collection<any>(participantId);
        const userConfig = await userCollection.findOne({ _id: "config" });

        participantsData[participantId] = {
          avatar: userConfig?.avatar || "",
          name: userConfig?.name || ""
        };
      }
      
      if (data.type === "online") {
        let messages = await collection
          .find({ _id: { $ne: "config" } })
          .sort({ _id: -1 })
          .limit(100)
          .toArray();

        socket.emit("load_chat_content_return", {
          code: 1,
          chatId: data.chatId,
          messages: messages.reverse(),
          participants: participantsData,
          type: data.type
        });
      } else {
        socket.emit("load_chat_content_return", {
          code: 1,
          chatId: data.chatId,
          participants: participantsData,
          type: data.type
        });
      }

    } catch (err) {
      console.log(`Error loading chat content:`, err);
      socket.emit("load_chat_content_return", {
        code: 0,
        chatId: data.chatId,
        error: "server_error"
      });
    }
  });
}
