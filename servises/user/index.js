const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(express.json());

// ======= LOGIN ENDPOINT ===========
app.post('/login', (req, res) => {
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

        const user = users.find(
            user => user.name === name && user.password === password
        );

        if (user) {
            // Генеруємо JWT токен з терміном дії 1 день
            const token = jwt.sign({ id_user: user._id }, SECRET_KEY, { expiresIn: '1d' });

            // Зберігаємо токен у файл
            fs.readFile(path.join(__dirname, 'tokens.json'), 'utf8', (err, tokensData) => {
                let tokensDB = {};
                if (!err) {
                    try {
                        tokensDB = JSON.parse(tokensData);
                    } catch (e) {
                        tokensDB = {};
                    }
                }

                if (!tokensDB[user._id]) {
                    tokensDB[user._id] = [];
                }
                tokensDB[user._id].push(token);

                fs.writeFile(
                    path.join(__dirname, 'tokens.json'),
                    JSON.stringify(tokensDB, null, 2),
                    (err) => {
                        if (err) {
                            console.error('Помилка при записі токена:', err);
                        }
                    }
                );
            });

            res.json([token, user]);
        } else {
            res.status(404).json({ error: 'Користувача не знайдено' });
        }
    });
});

app.post('/get_info_to_jwt', (req, res) => {
    const { jwt_token, id } = req.body;

    if (!jwt_token || !id) {
        return res.status(400).json({ error: 'Відсутній токен або id' });
    }

    let decoded;
    try {
        decoded = jwt.verify(jwt_token, SECRET_KEY);
    } catch (e) {
        return res.status(401).json({ error: 'Невірний токен' });
    }

    if (decoded.id_user !== id) {
        return res.status(401).json({ error: 'Токен не відповідає користувачу' });
    }

    fs.readFile(path.join(__dirname, 'tokens.json'), 'utf8', (err, tokensData) => {
        if (err) {
            console.error('Помилка при читанні tokens.json:', err);
            return res.status(500).json({ error: 'Помилка сервера' });
        }

        let tokensDB = {};
        try {
            tokensDB = JSON.parse(tokensData);
        } catch (e) {
            console.error('Помилка при парсингу tokens.json:', e);
            return res.status(500).json({ error: 'Помилка сервера' });
        }

        const userTokens = tokensDB[id];
        if (!userTokens || !userTokens.includes(jwt_token)) {
            return res.status(401).json({ error: 'Токен не знайдено для користувача' });
        }

        fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, usersData) => {
            if (err) {
                console.error('Помилка при читанні db.json:', err);
                return res.status(500).json({ error: 'Помилка сервера' });
            }

            let users;
            try {
                users = JSON.parse(usersData);
            } catch (e) {
                console.error('Помилка при парсингу db.json:', e);
                return res.status(500).json({ error: 'Помилка сервера' });
            }

            const user = users.find(u => u._id === id);
            if (!user) {
                return res.status(404).json({ error: 'Користувача не знайдено' });
            }

            res.json({
                status: 'good',
                user: user
            });
        });
    });
});

// ============ SOCKET.IO ============
io.on('connection', (socket) => {
    console.log('Користувач підключився:', socket.id);

    socket.on('authenticate', (data) => {
        const { token } = data;
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            console.log(`Користувач ${decoded.id_user} аутентифікований.`);
            socket.emit('authenticated', { status: 'ok' });
        } catch (e) {
            console.log('Невірний токен.');
            socket.emit('authenticated', { status: 'error', message: 'Невірний токен' });
            socket.disconnect();
        }
    });

    socket.on('disconnect', () => {
        console.log('Користувач відключився:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});
