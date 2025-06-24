import { getMainWindow } from '../models/mainWindow';
import { getToken, deleteToken, getUser } from '../models/storage_app';
import { generate_key } from './crypto_func';
import { safeParseJSON } from './utils';
import { login_to_jwt } from '../services/authentication';
import { startSocketClient } from '../controller/messagesController';

// let sss = 0;

async function check_app() {
  // if (sss == 0) {
  //   await deleteToken();
  //   sss = 1
  // }
  
  const tokenExists = await getToken();
  const userExists = await getUser();

  const first_parse = safeParseJSON(userExists);
  const user_json = safeParseJSON(first_parse);

  if (!tokenExists || !user_json["_id"]) {
    await generate_key();

    getMainWindow().loadFile('web/login.html');
  } else {
    login_to_jwt();

    getMainWindow().loadFile('web/index.html');

    getMainWindow().webContents.once('did-finish-load', () => {
      getMainWindow().webContents.send('reply', { type: "theme_load", theme: "dark" });
      startSocketClient().catch(console.error);
    });
  }
}

export { check_app };
