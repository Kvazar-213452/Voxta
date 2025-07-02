import { selectChat, loadChat, addMessageToChat, load_chats, addChats, highlightChatById } from '../chat/chat.js';
import { findChatIndex } from '../chat/utils.js';

export function handleChat(data) {
  if (data.type === "load_chats") {
    load_chats(data.chats);
    selectChat(1);
  } else if (data.type === "load_chat_content") {
    loadChat(data.content, data.chat_id, data.participants);
  } else if (data.type === "came_chat_msg") {
    if (data.chat_id === chat_id_select) {
      addMessageToChat(data.message, true);
    } else {
      let index = findChatIndex(chats, data.chat_id);
      highlightChatById(index);
    }
  } else if (data.type === "create_new_chat_render") {
    addChats(JSON.parse(data.chat));
  }
}
