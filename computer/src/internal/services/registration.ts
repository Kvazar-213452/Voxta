import axios from 'axios';
import { configServises } from '../../config';
import { encryptionMsg, getPublicKeyServer, decryptionApp } from '../utils/cryptoFunc';
import { getPublicKey, saveToken, getToken, deleteToken } from '../models/storageApp';
import { saveUser, getUser, deleteUser } from '../models/sqliteStorage/user';
import { getMainWindow } from '../models/mainWindow';

export async function register(msg: { [key: string]: any }): Promise<void> {
  try {
    const PublicKey_server = await getPublicKeyServer();

    const dataToEncrypt = JSON.stringify({
      name: msg["name"],
      password: msg["pasw"],
      gmail: msg["gmail"]
    });

    const encryption_json = encryptionMsg(PublicKey_server, dataToEncrypt);

    const response = await axios.post(`${configServises.AUTHENTICATION}/register`, {
      data: encryption_json,
      key: await getPublicKey()
    });

    if (response.data.code == 1) {
      getMainWindow().webContents.send('reply', {
        type: "regiter",
        code: 1
      });
    }
  } catch (error: any) {
    console.log(error);
    getMainWindow().webContents.send('reply', {
      type: "regiter",
      code: 0
    });
  }
}
