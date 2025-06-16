import axios from 'axios';
import { config } from '../../config';
import { encryption_msg, getPublicKey_server, decryption_app } from '../utils/crypto_func';
import { getPublicKey, saveToken, saveUser, getUser, getToken } from '../models/storage_app';
import { IpcMainEvent } from 'electron';
import { getMainWindow } from '../models/mainWindow';

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
      
      const user_str = JSON.stringify(parsed["user"]);
      
      await saveToken(parsed["token"]);
      await saveUser(user_str);

      event.reply('reply', parsed);
    }
  } catch (error: any) {
    console.log(error);
    event.reply('reply', { error: error.response?.data || 'error server' });
  }
}

export async function login_to_jwt(): Promise<void> {
  const mainWindow = getMainWindow();

  const PublicKey_server = await getPublicKey_server();
  const jwtToken = await getToken();
  const User = await getUser();

  const first_parse = JSON.parse(User!);
  const user_json = JSON.parse(first_parse);

  const dataToEncrypt = JSON.stringify({
    jwt: jwtToken,
    id: user_json["_id"]
  });

  const encryption_json = encryption_msg(PublicKey_server, dataToEncrypt);

  const response = await axios.post(config.get_info_to_jwt, {
    data: encryption_json,
    key: await getPublicKey()
  });

  if (response.data.code == 1) {
    let data_to_web = await decryption_app(response.data.data);
    const str_user = JSON.stringify(data_to_web);

    await saveUser(str_user);
    
    if (mainWindow) {
      mainWindow.webContents.once('did-finish-load', () => {
        mainWindow.webContents.send('reply', "dddddd");
      });
    }
  }
}
