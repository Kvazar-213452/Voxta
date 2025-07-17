import { Socket } from "socket.io";
import { Db, Collection } from "mongodb";
import { verifyAuth } from "../utils/verifyAuth";
import { generateId } from "../utils/generateId";
import { sendCreateChat } from "../utils/sendCreateChat";
import { getMongoClient } from "../models/mongoClient";
import { uploadAvatar } from "../utils/uploadData";

export function onCreateChat(socket: Socket, SECRET_KEY: string): void {
  socket.on("create_chat", async (data: { chat: Chat }) => {
    try {
      const auth = verifyAuth(socket, SECRET_KEY);
      if (!auth) return;

      if (data.chat.avatar) {
        const avatarUrl = await uploadAvatar(data.chat.avatar);
        data.chat.avatar = avatarUrl;
      }

      const client = await getMongoClient();
      const db: Db = client.db("chats");

      let chatId: string = generateId();
      while (await db.listCollections({ name: chatId }).hasNext()) {
        chatId = generateId();
      }

      const chatCollection: Collection = db.collection(chatId);

      const dataConfig = {
        _id: "config" as any,
        type: data.chat.privacy,
        avatar: data.chat.avatar,
        participants: [socket.data.userId],
        name: data.chat.name,
        createdAt: new Date().toISOString(),
        desc: data.chat.description,
        owner: socket.data.userId
      }

      await chatCollection.insertOne(dataConfig);

      const usersDb: Db = client.db("users");
      const userCollection: Collection = usersDb.collection(socket.data.userId);

      await userCollection.updateOne(
        { _id: "config" as any },
        { $addToSet: { chats: chatId, type: data.chat.privacy } }
      );

      sendCreateChat(socket.data.userId, JSON.stringify(dataConfig), chatId);

    } catch (error: unknown) {
      console.log("CONFIG DOC:", error);
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      socket.emit("chat_created", { code: 0, error: errorMessage });
    }
  });
}
