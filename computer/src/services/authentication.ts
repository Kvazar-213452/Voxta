import axios from 'axios';
import { configServises } from '../config';
import { encryptionMsg, getPublicKeyServer, decryptionApp } from '../utils/cryptoFunc';
import { getPublicKey, saveToken, getToken, deleteToken } from '../models/storageApp';
import { saveUser, getUser, deleteUser } from '../models/sqliteStorage/serviseUtils/user';
import { IpcMainEvent } from 'electron';
import { getMainWindow } from '../models/mainWindow';
import { safeParseJSON } from '../utils/utils';
import { MainApp } from '../utils/main';

export async function login(event: IpcMainEvent, msg: { [key: string]: any }): Promise<void> {
  try {
    const PublicKey_server = await getPublicKeyServer();

    const dataToEncrypt = JSON.stringify({
      name: msg.name,
      password: msg.pasw
    });

    const encryptionJson = encryptionMsg(PublicKey_server, dataToEncrypt);

    const response = await axios.post(`${configServises.AUTHENTICATION}/login`, {
      data: encryptionJson,
      key: await getPublicKey()
    });

    if (response.data.code == 1) {
      let dataFromServer = await decryptionApp(response.data.data);
      let parsed = safeParseJSON(dataFromServer);
      
      await saveToken(parsed.token);
      await saveUser(safeParseJSON(parsed.user));

      event.reply('reply', parsed);
      await MainApp();
    }
  } catch (error: any) {
    console.log(error);
    event.reply('reply', { error: error.response?.data || 'error server' });
  }
}

export async function loginToJwt(): Promise<void> {
  const PublicKey_server = await getPublicKeyServer();
  const jwtToken = await getToken();
  const User = await getUser();

  const first_parse = safeParseJSON(User);
  const userJson = safeParseJSON(first_parse);

  const dataToEncrypt = JSON.stringify({
    jwt: jwtToken,
    id: userJson.id
  });

  const encryptionJson = encryptionMsg(PublicKey_server, dataToEncrypt);

  const response = await axios.post(`${configServises.AUTHENTICATION}/get_info_to_jwt`, {
    data: encryptionJson,
    key: await getPublicKey()
  });

  if (response.data.code == 1) {
    let data = await decryptionApp(response.data.data);
    
    await saveUser(JSON.parse(data));
  } else {
    deleteUser();
    await deleteToken();

    getMainWindow().loadFile('web/login.html');
  }
}
