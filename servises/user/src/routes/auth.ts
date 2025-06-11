import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';

import { encryption_server, encryption_msg, decryption_server } from '../func/crypto_func';

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

// ======= login ENDPOINT ===========
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { data, key } = req.body;

    const dataToEncrypt = JSON.stringify({
        data
    });

    let code = JSON.parse(decryption_server(dataToEncrypt)) as { name: string; password: string; };

    let name = code.name;
    let password = code.password;

    console.log(name);


    try {
        const data = await fs.readFile(path.join(__dirname, '../db.json'), 'utf8');
        const users: User[] = JSON.parse(data);

        const user = users.find(u => u.name === name && u.password === password);

        if (!user) {
            res.status(404).json({ code: 0, error: 'user_none' });
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

        let json_str = encryption_server(`[${token}, ${user}]`);
        let json = JSON.parse(json_str);

        res.json({code: 1, data: json});
    } catch (err) {
        res.status(500).json({ code: 0, error: 'error_server' });
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