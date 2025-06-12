import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { encryption_msg, decryption_server } from '../utils/crypto_func';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY ?? '';

interface User {
    _id: string;
    name: string;
    password: string;
}

interface TokensDB {
    [userId: string]: string[];
}

export const getInfoToJwtHandler = async (req: Request, res: Response): Promise<void> => {
    const { data, key } = req.body;

    const decrypted = await decryption_server(data);
    const parsed = JSON.parse(decrypted);
    const jwt_token = parsed.jwt;
    const id = parsed.id;

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

        const tokensData = await fs.readFile(path.join(__dirname, '../../tokens.json'), 'utf8');
        const tokensDB: TokensDB = JSON.parse(tokensData);

        const userTokens = tokensDB[id];
        if (!userTokens || !userTokens.includes(jwt_token)) {
            res.status(401).json({ error: 'Токен не знайдено для користувача' });
            return;
        }

        const usersData = await fs.readFile(path.join(__dirname, '../../db.json'), 'utf8');
        const users: User[] = JSON.parse(usersData);

        const user = users.find(u => u._id === id);
        if (!user) {
            res.status(404).json({ error: 'Користувача не знайдено' });
            return;
        }

        const dataToEncrypt = JSON.stringify(user);
        const json = encryption_msg(key, dataToEncrypt);

        res.json({code: 1, data: json});
    } catch (e) {
        console.error('Помилка сервера:', e);
        res.status(401).json({ error: 'Невірний токен' });
    }
};
