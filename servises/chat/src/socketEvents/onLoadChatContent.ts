import { Socket } from "socket.io";
import { getMongoClient } from "../models/mongoClient";
import { verifyAuth } from "../utils/verifyAuth";
import { Db } from "mongodb";

export function onLoadChatContent(socket: Socket, SECRET_KEY: string) {
  socket.on("load_chat_content", async (data: { chat_id: string, type: string }) => {
    try {
      const auth = verifyAuth(socket, SECRET_KEY);
      if (!auth) return;

      const client = await getMongoClient();
      const db: Db = client.db("chats");

      const collection = db.collection<any>(data.chat_id);

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
          chat_id: data.chat_id,
          messages: messages.reverse(),
          participants: participantsData,
          type: data.type
        });
      } else {
        socket.emit("load_chat_content_return", {
          code: 1,
          chat_id: data.chat_id,
          participants: participantsData,
          type: data.type
        });
      }

    } catch (err) {
      console.log(`Error loading chat content:`, err);
      socket.emit("load_chat_content_return", {
        code: 0,
        chat_id: data.chat_id,
        error: "server_error"
      });
    }
  });
}
