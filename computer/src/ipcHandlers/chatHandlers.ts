import { loadChatContent, reconnectSocketClient } from '../services/chat/chatController';
import { sendMessage } from '../services/chat/utils/sendMsg';
import { createChat, createChatServer } from '../services/chat/utils/createChat';
import { addUserInChat, delUserInChat, saveChatSettings } from '../services/chat/utils/chat';

export async function handleChat(msg: any): Promise<boolean> {
  if (msg.type === 'load_chat') {
    loadChatContent(msg.id, msg.type_chat);
    return true;
  } else if (msg.type === 'send_msg') {
    await sendMessage(msg.message, msg.chat_id, msg.chat_type);
    return true;
  } else if (msg.type === 'reconnect_socket_client') {
    await reconnectSocketClient();
    return true;
  } else if (msg.type === 'create_chat') {
    createChat(msg.chat);
    return true;
  } else if (msg.type === 'add_user_in_chat') {
    addUserInChat(msg.id, msg.userId);
    return true;
  } else if (msg.type === 'del_user_in_chat') {
    delUserInChat(msg.id, msg.userId);
    return true;
  } else if (msg.type === 'save_chat_settings') {
    saveChatSettings(msg.id, msg.dataChat);
    return true;
  } else if (msg.type === 'create_chat_server') {
    createChatServer(msg.chat);
    return true;
  }

  return false;
}
