import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { encryption_msg, decryption_server } from '../utils/crypto_func';
import dotenv from 'dotenv';

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

export async function loginHandler(req: Request, res: Response): Promise<void> {
    const { data, key } = req.body;

    try {
        const decrypted = await decryption_server(data);
        const parsed = JSON.parse(decrypted);
        const name = parsed.name;
        const password = parsed.password;

        const dbPath = path.join(__dirname, '../../db.json');
        const tokensPath = path.join(__dirname, '../../tokens.json');

        const dbData = await fs.readFile(dbPath, 'utf8');
        const users: User[] = JSON.parse(dbData);

        const user = users.find(u => u.name === name && u.password === password);

        if (!user) {
            res.status(404).json({ code: 0, error: 'user_none' });
            return;
        }

        const token = jwt.sign({ id_user: user._id }, SECRET_KEY, { expiresIn: '1d' });

        let tokensDB: TokensDB = {};
        try {
            const tokensData = await fs.readFile(tokensPath, 'utf8');
            tokensDB = JSON.parse(tokensData);
        } catch {
            tokensDB = {};
        }

        if (!tokensDB[user._id]) {
            tokensDB[user._id] = [];
        }
        tokensDB[user._id].push(token);

        await fs.writeFile(tokensPath, JSON.stringify(tokensDB, null, 2));

        const dataToEncrypt = JSON.stringify({
            token: token,
            user: user
        });

        const json = encryption_msg(key, dataToEncrypt);

        res.json({ code: 1, data: json });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ code: 0, error: 'error_server' });
    }
}
