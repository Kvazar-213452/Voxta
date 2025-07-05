import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';
import { Db, Collection } from "mongodb";
import { encryptionMsg, decryptionServer } from '../utils/cryptoFunc';
import { getMongoClient } from '../models/getMongoClient';
import { generateId } from '../utils/utils';
import CONFIG from '../config';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY ?? 'default_secret';

function generateSixDigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function registerHandler(req: Request, res: Response): Promise<void> {
  const { data, key } = req.body;

  try {
    const decrypted = await decryptionServer(data);
    const parsed: RegisterData = JSON.parse(decrypted);

    const name = parsed.name;
    const password = parsed.password;
    const gmail = parsed.gmail;
    const code = generateSixDigitCode();

    await axios.post(`${CONFIG.SERVIS_NOTIFICATION}/send_gmail`, {
      data: [code, gmail]
    });

    const tempToken = jwt.sign({ name, password, gmail, code }, SECRET_KEY, { expiresIn: '5m' });

    const responsePayload = JSON.stringify({
        tempToken: tempToken
    });

    const encrypted = encryptionMsg(key, responsePayload);

    res.json({ code: 1, data: encrypted });
  } catch (err) {
    console.error('register Error:', err);
    res.status(500).json({ code: 0, error: 'error_server' });
  }
}

export async function registerVerificationHandler(req: Request, res: Response): Promise<void> {
  const { data, key } = req.body;

  try {
    const decrypted = await decryptionServer(data);
    const parsed = JSON.parse(decrypted);
    const inputCode = parsed.code;
    const tempTokenVal = parsed.tempToken;

    const decoded = jwt.verify(tempTokenVal, SECRET_KEY) as {
      name: string;
      password: string;
      gmail: string;
      code: string;
    };

    if (inputCode === decoded.code) {
      const name = decoded.name;
      const password = decoded.password;
      const gmail = decoded.gmail;

      const client = await getMongoClient();
      const db: Db = client.db("users");

      let userID: string = generateId();
      while (await db.listCollections({ name: userID }).hasNext()) {
        userID = generateId();
      }

      const chatCollection: Collection = db.collection(userID);

      const dataConfig = {
        _id: "config" as any,
        name,
        password,
        avatar: CONFIG.AVATAR,
        time: new Date().toISOString(),
        desc: "new acaunt",
        id: userID,
        gmail,
        chats: [CONFIG.ID_CHAT_MAIN]
      };

      await chatCollection.insertOne(dataConfig);

      const userToken = jwt.sign({ id_user: userID }, SECRET_KEY, { expiresIn: '1d' });

      const jwtCollection = db.collection<{ _id: string; token: string[] }>(userID);
      const jwtDoc = await jwtCollection.findOne({ _id: 'jwt' });

      if (jwtDoc) {
        await jwtCollection.updateOne({ _id: 'jwt' }, { $push: { token: userToken } });
      } else {
        await jwtCollection.insertOne({ _id: 'jwt', token: [userToken] });
      }

      const responsePayload = JSON.stringify({
        token: userToken,
        user: JSON.stringify(dataConfig, null, 2)
      });

      const encrypted = encryptionMsg(key, responsePayload);

      res.json({ code: 1, data: encrypted });
    } else {
      res.json({ code: 0 });
    }
  } catch (err) {
    console.error('registerVerification Error:', err);
    res.status(500).json({ code: 0, error: 'error_server' });
  }
}
