import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { getMongoClient } from '../../models/mongoClient';
import { addServer } from '../../utils/serverChats';
import { Db } from 'mongodb';
import { SECRET_KEY } from '../../main'
import { transforUser } from '../../utils/transform'

export function onAuthenticate(socket: Socket): void {
  socket.on('authenticate', async (data: { token: string, chats }) => {
    try {
      if (data.token === 'server') {
        addServer(socket.id, data.chats);
        socket.data.typeUser = 'ASO';
        socket.emit('authenticated', { code: 1, id: socket.id});
        return
      }

      const decoded = jwt.verify(data.token, SECRET_KEY) as { userId: string };

      console.log(`user ${decoded.userId} authenticated.`);
      socket.data.userId = decoded.userId;
      socket.data.token = data.token;
      socket.data.typeUser = 'user';

      const client = await getMongoClient();
      const db: Db = client.db('users');
      const collection = db.collection<any>(decoded.userId);

      let userConfig = await collection.findOne({ _id: 'config' });
      userConfig._id = userConfig.id;
      delete userConfig.id;

      if (!userConfig) {
        socket.emit('authenticated', { code: 0 });
        socket.disconnect();
        return;
      }

      socket.emit('authenticated', {
        code: 1,
        user: transforUser(userConfig)
      });

    } catch (error) {
      socket.emit('authenticated', { code: 0 });
      socket.disconnect();
    }
  });
}
