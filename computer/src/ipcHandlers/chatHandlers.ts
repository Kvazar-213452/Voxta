import { reconnectSocketClient } from '../internal/services/chat/chatController';
import { loadChatContent } from '../internal/services/chat/utils/chatFunc';
import { sendMessage } from '../internal/services/chat/utils/sendMsg';
import { createChat } from '../internal/services/chat/utils/createChat';
import { getInfoUsers, getInfoUser } from '../internal/services/chat/utils/getInfoUsers';

export async function handleChat(msg: any): Promise<boolean> {
  if (msg.type === 'load_chat') {
    loadChatContent(msg.id, msg.type_chat);
    return true;
  } else if (msg.type === 'send_msg') {
    sendMessage(msg.message, msg.chat_id, msg.chat_type);
    return true;
  } else if (msg.type === 'reconnect_socket_client') {
    await reconnectSocketClient();
    return true;
  } else if (msg.type === 'create_chat') {
    createChat(msg.chat);
    return true;
  } else if (msg.type === 'get_info_users') {
    getInfoUsers(msg.users);
    return true;
  } else if (msg.type === 'get_info_user') {
    getInfoUser(msg.id);
    return true;
  }
  return false;
}
