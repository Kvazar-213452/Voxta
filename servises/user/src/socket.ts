import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY ?? '';

export function setupSocket(io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log('Користувач підключився:', socket.id);

        socket.on('authenticate', (data: { token: string }) => {
            try {
                const decoded = jwt.verify(data.token, SECRET_KEY) as { id_user: string };
                console.log(`Користувач ${decoded.id_user} аутентифікований.`);
                socket.emit('authenticated', { status: 'ok' });
            } catch {
                console.log('Невірний токен.');
                socket.emit('authenticated', { status: 'error', message: 'Невірний токен' });
                socket.disconnect();
            }
        });

        socket.on('disconnect', () => {
            console.log('Користувач відключився:', socket.id);
        });
    });
}
