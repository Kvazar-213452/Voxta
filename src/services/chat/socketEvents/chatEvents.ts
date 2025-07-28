import { Socket } from 'socket.io-client';
import { getMainWindow } from '../../../models/mainWindow';
import { addChatOflineOnDB, loadChatContentLocal } from '../utils/chat';
import { safeParseJSON } from '../../../utils/utils';
import { sendMsgOffline } from '../../trafficJams/trafficJams'
import { getMsgOffline } from '../utils/sendMsg'

export function registerChatEvents(socket: Socket) {
  socket.on('chats_info', (data) => {
    if (data.code) {
      getMainWindow().webContents.send('reply', { type: 'load_chats', chats: data.chats });
    } else {
      getMainWindow().webContents.send('reply', { type: 'error_div', content: "chats_info" });
    }
  });

  socket.on('chat_info', (data) => {
    if (!data.code) {
      getMainWindow().webContents.send('reply', { type: 'error_div', content: "chat_info" });
    } else if (data.type == 'profile') {
      let chat = data.chat;
      chat = safeParseJSON(chat);

      sendMsgOffline(safeParseJSON(getMsgOffline()), chat.participants);
    } else if (data.type == 'settings_chat') {
      getMainWindow().webContents.send('reply', {
        type: 'chat_settings_load',
        chat: data.chat
      });
    }
  });

  socket.on('create_new_chat', (data) => {
    if (!data.code) {
      getMainWindow().webContents.send('reply', { type: 'error_div', content: "create_new_chat" });
    }
    let dataChat = data.chat;
    dataChat = safeParseJSON(dataChat);

    if (dataChat.type === 'offline') {
      addChatOflineOnDB(data.chatId);
    }

    getMainWindow().webContents.send('reply', {
      type: 'create_new_chat_render',
      chat: data.chat
    });
  });

  socket.on('load_chat_content_return', (data) => {
    if (!data.code) {
      getMainWindow().webContents.send('reply', { type: 'error_div', content: "load_chat_content_return" });
    } else if (data.type === 'offline') {
      loadChatContentLocal(data.chatId, data.participants);
    } else {
      getMainWindow().webContents.send('reply', {
        type: 'load_chat_content',
        content: data.messages,
        chat_id: data.chatId,
        participants: data.participants
      });
    }
  });

  socket.on('add_user_in_chat', (data) => {
    console.log(data.code);
  });

  socket.on('del_user_in_chat', (data) => {
    console.log(data.code);
  });
}
