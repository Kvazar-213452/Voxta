import { Socket } from 'socket.io-client';
import { getMainWindow } from '../../../models/mainWindow';

export function registerUserEvents(socket: Socket) {
  socket.on('get_info_users_return', (data) => {
    if (data.type === "info_panel") {
      getMainWindow().webContents.send('reply', {
        type: 'info_users',
        users: data.users,
      });
    } else if (data.type === "chat_settings") {
      getMainWindow().webContents.send('reply', {
        type: 'chat_settings',
        users: data.users,
      });
    } else if (data.type === 'friends_modal_render') {
      getMainWindow().webContents.send('reply', {
        type: 'friends_modal_render',
        friends: data.users,
      });
    } else if (data.type === 'friends_add_chat_modal_render') {
      getMainWindow().webContents.send('reply', {
        type: 'friends_add_chat_modal_render',
        friends: data.users,
      });
    }
  });

  socket.on('get_info_user_return', (data) => {
    if (data.type === 'simple') {
      getMainWindow().webContents.send('reply', {
        type: 'info_user',
        user: data.user,
      });
    } else if (data.type === 'profile') {
      getMainWindow().webContents.send('reply', {
        type: 'info_user_profile',
        user: data.user,
      });
    } else if (data.type === "chat_settings_admin") {
      getMainWindow().webContents.send('reply', {
        type: 'chat_settings_admin_web',
        user: data.user,
      });
    }
  });

  socket.on('get_friends', (data) => {
    if (data.type === "modal_friends") {
      getMainWindow().webContents.send('reply', {
        type: 'friends_modal',
        friends: data.friends,
      });
    } else if (data.type === "add_friend_in_chat") {
      getMainWindow().webContents.send('reply', {
        type: 'add_friend_in_chat_web',
        friends: data.friends,
      });
    }
  });

  socket.on('del_friend', (data) => {
    getMainWindow().webContents.send('reply', {
      type: 'friends_modal',
      friends: data.friends,
    });
  });
}
