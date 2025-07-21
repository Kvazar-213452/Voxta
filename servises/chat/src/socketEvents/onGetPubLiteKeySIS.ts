import { Socket } from "socket.io";
import { verifyAuth } from "../utils/verifyAuth";
import { getServerIdToChat } from "../utils/serverChats";
import { getIO } from '../main';

const pendingCallbacks = new Map<string, (data: string) => void>();

export function onGetPubLiteKeySIS(socket: Socket, SECRET_KEY: string): void {
  socket.on("get_pub_lite_key_SIS", async (data: { id: string }, callback) => {
    try {
      const auth = verifyAuth(socket, SECRET_KEY);
      if (!auth) {
        callback({ code: 0, error: "unauthorized" });
        return;
      }

      const serverId = getServerIdToChat(data.id);
      const requestId = `${socket.id}_${Date.now()}`;

      pendingCallbacks.set(requestId, callback);

      setTimeout(() => {
        if (pendingCallbacks.has(requestId)) {
          pendingCallbacks.delete(requestId);
          callback({ code: 0, error: "timeout" });
        }
      }, 30000);
      
      getIO().to(String(serverId)).emit("get_lite_key", { requestId });
      
    } catch (error) {
      console.error("get_pub_lite_key_SIS error:", error);
      callback({ code: 0, error: "server_error" });
    }
  });
  
  socket.on("get_pub_lite_key_SIS_return", (responseData: { data: string, requestId?: string }) => {
    if (responseData.requestId && pendingCallbacks.has(responseData.requestId)) {
      const callback = pendingCallbacks.get(responseData.requestId)!;
      pendingCallbacks.delete(responseData.requestId);
      callback(responseData.data);
    }
  });
}