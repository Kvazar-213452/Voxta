import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';
import { encryptionMsg, decryptionServer } from '../utils/cryptoFunc';
import { getMongoClient } from '../models/getMongoClient';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY ?? '';

export async function registerHandler(req: Request, res: Response): Promise<void> {
  const { data, key } = req.body;

  try {
    const decrypted = await decryptionServer(data);
    const parsed = JSON.parse(decrypted);
    const name = parsed.name;
    const password = parsed.password;
    const gmail = parsed.gmail;
    const code: number = generateSixDigitCode();

    req.session.code = code;
    req.session.name = name;
    req.session.password = password;
    req.session.gmail = gmail;

    await axios.post('http://localhost:3005/send_gmail', {
      data: [code, gmail]
    });

    res.json({ code: 1 });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ code: 0, error: 'error_server' });
  }
}

export async function registerVerificationHandler(req: Request, res: Response): Promise<void> {
  const { data, key } = req.body;

  try {
    const decrypted = await decryptionServer(data);
    const parsed = JSON.parse(decrypted);
    const code = parsed.code;

    if (code == req.session.code) {
        let name = req.session.name;
        let password = req.session.password;
        let gmail = req.session.gmail;
        res.json({ code: 1 });
    } else {
        res.json({ code: 0 });
    }
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ code: 0, error: 'error_server' });
  }
}

function generateSixDigitCode(): number {
  return Math.floor(100000 + Math.random() * 900000);
}
