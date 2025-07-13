import { Socket } from 'socket.io-client';
import { getMainWindow } from '../../../models/mainWindow';

export function registerUserEvents(socket: Socket) {
  socket.on('get_info_users_return', (data) => {
    getMainWindow().webContents.send('reply', {
      type: 'info_users',
      users: data.users,
    });
  });

  socket.on('get_info_user_return', (data) => {
    if (data.type == 'simple') {
      getMainWindow().webContents.send('reply', {
        type: 'info_user',
        user: data.user,
      });
    } else if (data.type == 'profile') {
      getMainWindow().webContents.send('reply', {
        type: 'info_user_profile',
        user: data.user,
      });
    }
  });
}
