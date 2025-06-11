import axios from 'axios';
import { config } from '../../config';
import { encryption_msg, getPublicKey_server } from '../utils/crypto_func';
import { getPublicKey } from '../models/storage_app';
import { IpcMainEvent } from 'electron';

export async function login(event: IpcMainEvent, msg: { [key: string]: any }): Promise<void> {
  try {
    const PublicKey_server = await getPublicKey_server();

    // Правильно сформуємо JSON перед шифруванням
    const dataToEncrypt = JSON.stringify({
      name: msg["name"],
      password: msg["pasw"]
    });

    const encryption_json = encryption_msg(PublicKey_server, dataToEncrypt);

    // Надсилаємо ЗАШИФРОВАНИЙ рядок на сервер (не парсимо!)
    const response = await axios.post(config.login_url, {
      data: encryption_json,
      key: await getPublicKey()
    });

    event.reply('reply', response.data);
  } catch (error: any) {
    event.reply('reply', { error: error.response?.data || 'error server' });
  }
}
