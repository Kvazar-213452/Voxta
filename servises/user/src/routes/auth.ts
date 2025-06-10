import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';

const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY ?? '';

interface User {
    _id: string;
    name: string;
    password: string;
}

interface TokensDB {
    [userId: string]: string[];
}

// Login endpoint
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { name, password } = req.body;

    try {
        const data = await fs.readFile(path.join(__dirname, '../db.json'), 'utf8');
        const users: User[] = JSON.parse(data);

        const user = users.find(u => u.name === name && u.password === password);

        if (!user) {
            res.status(404).json({ error: 'Користувача не знайдено' });
            return;
        }

        const token = jwt.sign({ id_user: user._id }, SECRET_KEY, { expiresIn: '1d' });

        let tokensDB: TokensDB = {};
        try {
            const tokensData = await fs.readFile(path.join(__dirname, '../tokens.json'), 'utf8');
            tokensDB = JSON.parse(tokensData);
        } catch {
            tokensDB = {};
        }

        if (!tokensDB[user._id]) {
            tokensDB[user._id] = [];
        }
        tokensDB[user._id].push(token);

        await fs.writeFile(path.join(__dirname, '../tokens.json'), JSON.stringify(tokensDB, null, 2));

        res.json([token, user]);

    } catch (err) {
        console.error('Помилка сервера:', err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

// Get info by JWT endpoint
router.post('/get_info_to_jwt', async (req: Request, res: Response): Promise<void> => {
    const { jwt_token, id } = req.body;

    if (!jwt_token || !id) {
        res.status(400).json({ error: 'Відсутній токен або id' });
        return;
    }

    try {
        const decoded = jwt.verify(jwt_token, SECRET_KEY) as { id_user: string };

        if (decoded.id_user !== id) {
            res.status(401).json({ error: 'Токен не відповідає користувачу' });
            return;
        }

        const tokensData = await fs.readFile(path.join(__dirname, '../tokens.json'), 'utf8');
        const tokensDB: TokensDB = JSON.parse(tokensData);

        const userTokens = tokensDB[id];
        if (!userTokens || !userTokens.includes(jwt_token)) {
            res.status(401).json({ error: 'Токен не знайдено для користувача' });
            return;
        }

        const usersData = await fs.readFile(path.join(__dirname, '../db.json'), 'utf8');
        const users: User[] = JSON.parse(usersData);

        const user = users.find(u => u._id === id);
        if (!user) {
            res.status(404).json({ error: 'Користувача не знайдено' });
            return;
        }

        res.json({
            status: 'good',
            user
        });
    } catch (e) {
        console.error('Помилка сервера:', e);
        res.status(401).json({ error: 'Невірний токен' });
    }
});

export default router;