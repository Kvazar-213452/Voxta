import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { encryptionMsg, decryptionServer } from '../utils/cryptoFunc';
import { getMongoClient } from '../models/getMongoClient';
import { transforUser } from '../utils/utils'

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY ?? '';

export async function getInfoToJwtHandler(req: Request, res: Response): Promise<void> {
  const { data, key } = req.body;

  try {
    const decrypted = await decryptionServer(data);
    const parsed = JSON.parse(decrypted);
    const jwtToken = parsed.jwt;
    const id = parsed.id;

    if (!jwtToken || !id) {
      res.json({ code: 0, data: 'no data' });
      return;
    }

    const decoded = jwt.verify(jwtToken, SECRET_KEY) as { id_user: string };

    if (decoded.id_user !== id) {
      res.json({ code: 0, data: 'error jwt no user' });
      return;
    }

    const client = await getMongoClient();
    const db = client.db('users');
    const collection = db.collection<UserConfig>(id);

    const config = await collection.findOne({ _id: 'config' });
    if (!config) {
      res.json({ code: 0, data: 'error user not found' });
      return;
    }

    const foundUser: any = {...config};
    foundUser._id = foundUser.id;
    delete foundUser.id;

    const jwtCollection = db.collection<JWTDocument>(id);
    const jwtDoc = await jwtCollection.findOne({ _id: 'jwt' });
    const userTokens: string[] = jwtDoc?.token ?? [];

    if (!userTokens.includes(jwtToken)) {
      res.json({ code: 0, data: 'error jwt not found' });
      return;
    }

    const dataToEncrypt = JSON.stringify(transforUser(foundUser));
    const json = encryptionMsg(key, dataToEncrypt);

    res.json({ code: 1, data: json });
  } catch (e) {
    console.error('getInfoToJwtHandler error:', e);
    res.json({ code: 0, data: 'error jwt' });
  }
}

