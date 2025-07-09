import axios from 'axios';
import { configServises } from '../../config';
import { encryptionMsg, getPublicKeyServer, decryptionApp } from '../utils/cryptoFunc';
import { getPublicKey, saveToken } from '../models/storageApp';
import { saveUser } from '../models/sqliteStorage/serviseUtils/user';
import { getMainWindow } from '../models/mainWindow';
import { MainApp } from '../utils/start';

let tempToken: string;

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
      let data_to_web = await decryptionApp(response.data.data);
      let parsed = JSON.parse(data_to_web);

      tempToken = parsed["tempToken"]

      getMainWindow().loadFile('web/registerVerification.html');
    }
  } catch (error: any) {
    console.log(error);
  }
}

export async function registerVerification(msg: { [key: string]: any }): Promise<void> {
  try {
    const PublicKey_server = await getPublicKeyServer();

    const dataToEncrypt = JSON.stringify({
      code: msg["code"],
      tempToken: tempToken
    });

    const encryption_json = encryptionMsg(PublicKey_server, dataToEncrypt);

    const response = await axios.post(`${configServises.AUTHENTICATION}/register_verification`, {
      data: encryption_json,
      key: await getPublicKey()
    });

    if (response.data.code == 1) {
        let data_to_web = await decryptionApp(response.data.data);
        let parsed = JSON.parse(data_to_web);

        await saveToken(parsed["token"]);
        const userObject = JSON.parse(parsed["user"]);

        if (userObject.id) {
          userObject._id = userObject.id;
          delete userObject.id;
        }

        await saveUser(userObject);

        await MainApp();
    } else {
      getMainWindow().webContents.send('reply', {
        type: "register_verification",
        code: 0
      });
    }
  } catch (error: any) {
    console.log(error);
  }
}
