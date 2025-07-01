import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { encryptionMsg, decryptionServer } from '../utils/cryptoFunc';
import { getMongoClient } from '../models/getMongoClient';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY ?? '';

export async function loginHandler(req: Request, res: Response): Promise<void> {
  const { data, key } = req.body;

  try {
    const decrypted = await decryptionServer(data);
    const parsed = JSON.parse(decrypted);
    const name = parsed.name;
    const password = parsed.password;

    const client = await getMongoClient();
    const db = client.db('users');

    const collections = await db.listCollections().toArray();
    let foundUser: any = null;
    let userCollectionName: string | null = null;

    for (const col of collections) {
    const collection = db.collection<{ _id: string; [key: string]: any }>(col.name);
    const config = await collection.findOne({ _id: 'config' });

    if (config && config.name === name && config.password === password) {
        foundUser = { ...config };
        userCollectionName = col.name;
        break;
    }
    }

    if (!foundUser || !userCollectionName) {
      res.status(404).json({ code: 0, error: 'user_none' });
      return;
    }

    foundUser._id = foundUser.id;
    delete foundUser.id;

    const token = jwt.sign({ id_user: foundUser._id }, SECRET_KEY, { expiresIn: '1d' });

    const jwtCollection = db.collection<{ _id: string; token: string[] }>(userCollectionName);
    const jwtDoc = await jwtCollection.findOne({ _id: 'jwt' });

    if (jwtDoc) {
      await jwtCollection.updateOne({ _id: 'jwt' }, { $push: { token } });
    } else {
      await jwtCollection.insertOne({ _id: 'jwt', token: [token] });
    }

    const responsePayload = JSON.stringify({
      token: token,
      user: JSON.stringify(foundUser, null, 2)
    });

    const encrypted = encryptionMsg(key, responsePayload);
    res.json({ code: 1, data: encrypted });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ code: 0, error: 'error_server' });
  }
}
