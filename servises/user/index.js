const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

app.use(express.json());

app.post('/check_user', (req, res) => {
    const { name, password } = req.body;

    fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Помилка при читанні файлу:', err);
            return res.status(500).json({ error: 'Помилка сервера' });
        }

        let users;
        try {
            users = JSON.parse(data);
        } catch (parseError) {
            console.error('Помилка при парсингу JSON:', parseError);
            return res.status(500).json({ error: 'Помилка сервера' });
        }

        const userExists = users.find(
            user => user.name === name && user.password === password
        );

        if (userExists) {
            res.json(users);
        } else {
            res.status(404).json({ error: 'Користувача не знайдено' });
        }
    });
});

io.on('connection', (socket) => {
    console.log('Користувач підключився:', socket.id);

    socket.on('join', (data) => {
        console.log(`Користувач ${data.userId} приєднався до чату`);
    });

    socket.on('disconnect', () => {
        console.log('Користувач відключився:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});
