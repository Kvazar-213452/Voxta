import axios from 'axios';
import { config } from '../../config';
import { encryption_msg, getPublicKey_server, decryption_app } from '../utils/crypto_func';
import { getPublicKey } from '../models/storage_app';
import { IpcMainEvent } from 'electron';

export async function login(event: IpcMainEvent, msg: { [key: string]: any }): Promise<void> {
  try {
    const PublicKey_server = await getPublicKey_server();

    const dataToEncrypt = JSON.stringify({
      name: msg["name"],
      password: msg["pasw"]
    });

    const encryption_json = encryption_msg(PublicKey_server, dataToEncrypt);

    const response = await axios.post(config.login_url, {
      data: encryption_json,
      key: await getPublicKey()
    });

    if (response.data.code == 1) {
      let data_to_web = await decryption_app(response.data.data);
      let parsed = JSON.parse(data_to_web);
      
      event.reply('reply', parsed);
    }
  } catch (error: any) {
    console.log(error);
    event.reply('reply', { error: error.response?.data || 'error server' });
  }
}
