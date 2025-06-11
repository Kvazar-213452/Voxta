import express, { Request, Response } from 'express';
import fs from 'fs';

const router = express.Router();

const publicKey = fs.readFileSync('public_key.pem', 'utf8');

router.get('/public_key', (_req: Request, res: Response) => {
    res.json({ key: publicKey });
});

export default router;
