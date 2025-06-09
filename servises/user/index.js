const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
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

app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});
