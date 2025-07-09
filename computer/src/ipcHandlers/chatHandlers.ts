import { loadChatContent, reconnectSocketClient } from '../internal/services/chat/chatController';
import { sendMessage } from '../internal/services/chat/utils/sendMsg';
import { createChat } from '../internal/services/chat/utils/createChat';
import { getInfoUsers, getInfoUser, getInfoChat } from '../internal/services/chat/utils/getInfo';

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
  } else if (msg.type === 'load_chat_info_for_settings') {
    getInfoChat(msg.id);
    return true;
  }
  return false;
}
