import { Socket } from "socket.io"; 
import { getMongoClient } from "../models/mongoClient";
import { verifyAuth } from "../utils/verifyAuth";
import { Db } from "mongodb";

export function onLoadChatContent(socket: Socket, SECRET_KEY: string) {
  socket.on("load_chat_content", async (data: { chat_id: string }) => {
    try {
      const auth = verifyAuth(socket, SECRET_KEY);
      if (!auth) return;

      const client = await getMongoClient();
      const db: Db = client.db("chats");

      try {
        const collection = db.collection<any>(data.chat_id);

        const messages = await collection
          .find({ _id: { $ne: "config" } })
          .sort({ _id: -1 })
          .limit(100)
          .toArray();

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

          if (userConfig) {
            participantsData[participantId] = {
              avatar: userConfig.avatar || "",
              name: userConfig.name || ""
            };
          } else {
            participantsData[participantId] = {
              avatar: "",
              name: ""
            };
          }
        }

        socket.emit("load_chat_content_return", {
          code: 1,
          chat_id: data.chat_id,
          messages: messages.reverse(),
          participants: participantsData
        });

      } catch (err) {
        console.error(`error loading chat ${data.chat_id}:`, err);
        socket.emit("load_chat_content_return", {
          code: 0,
          chat_id: data.chat_id,
          error: "chat_not_found"
        });
      }

    } catch (error) {
      console.error("getInfoChats error:", error);
      socket.emit("load_chat_content_return", { code: 0, error: "server_error" });
    }
  });
}