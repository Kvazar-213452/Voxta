import { Request, Response } from 'express';
import axios from 'axios';
import { generate_code } from './func';
import CONFIG from '../config';

// register.ts

export async function register_start(req: Request, res: Response) {
  try {
    const data = req.body.data;
    let name: string = data[0];
    let pasw: string = data[1];
    let gmail: string = data[2];
    let code: string = generate_code();

    req.session.name = name;
    req.session.pasw = pasw;
    req.session.gmail = gmail;
    req.session.code = code;

    const response = await axios.post(CONFIG.HEAD_SERVER + 'register', {
      data: [gmail, code]
    });

    res.send(1);
  } catch (error) {
    console.error(error);
    res.status(500).send(2);
  }
}

export async function register_end(req: Request, res: Response) {
  try {
    const data = req.body.data;
    let code: string = data[0];

    if (req.session.code == code) {
        res.send(1);
    } else {
        res.send(0);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(2);
  }
}
