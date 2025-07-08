import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { encryptionMsg, decryptionServer } from '../utils/cryptoFunc';
import { getMongoClient } from '../models/getMongoClient';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY ?? '';

interface UserConfig {
  _id: string;
  name: string;
  password: string;
  time?: string;
  avatar?: string;
  desc?: string;
  chats?: string[];
  id?: string;
}

declare interface JWTDocument {
  _id: string;
  token: string[];
}

export async function getInfoToJwtHandler(req: Request, res: Response): Promise<void> {
  const { data, key } = req.body;

  try {
    const decrypted = await decryptionServer(data);
    const parsed = JSON.parse(decrypted);
    const jwt_token = parsed.jwt;
    const id = parsed.id;

    if (!jwt_token || !id) {
      res.json({ code: 0, data: "no data" });
      return;
    }

    const decoded = jwt.verify(jwt_token, SECRET_KEY) as { id_user: string };

    if (decoded.id_user !== id) {
      res.json({ code: 0, data: "error jwt no user" });
      return;
    }

    const client = await getMongoClient();
    const db = client.db('users');
    const collection = db.collection<UserConfig>(id);

    const config = await collection.findOne({ _id: 'config' });
    if (!config) {
      res.json({ code: 0, data: "error user not found" });
      return;
    }

    const foundUser = {
      ...config,
      _id: config.id || config._id
    };
    delete (foundUser as any).id;

    const jwtCollection = db.collection<JWTDocument>(id);
    const jwtDoc = await jwtCollection.findOne({ _id: 'jwt' });
    const userTokens: string[] = jwtDoc?.token ?? [];

    if (!userTokens.includes(jwt_token)) {
      res.json({ code: 0, data: "error jwt not found" });
      return;
    }

    const dataToEncrypt = JSON.stringify(foundUser);
    const json = encryptionMsg(key, dataToEncrypt);

    res.json({ code: 1, data: json });
  } catch (e) {
    console.error("getInfoToJwtHandler error:", e);
    res.json({ code: 0, data: "error jwt" });
  }
}
