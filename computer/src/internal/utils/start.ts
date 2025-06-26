import { getMainWindow } from '../models/mainWindow';
import { getToken, deleteToken } from '../models/storageApp';
import { getUser } from '../models/sqliteStorage';
import { generateKey } from './cryptoFunc';
import { safeParseJSON } from './utils';
import { loginToJwt } from '../services/authentication';
import { startSocketClient } from '../services/messagesController';

// let sss = 0;

async function MainApp() {
  // if (sss == 0) {
  //   await deleteToken();
  //   sss = 1
  // }
  
  const tokenExists = await getToken();
  const userExists = await getUser();
  const user = safeParseJSON(userExists);

  if (!tokenExists || !user["_id"]) {
    await generateKey();

    getMainWindow().loadFile('web/login.html');
  } else {
    loginToJwt();

    getMainWindow().loadFile('web/index.html');

    getMainWindow().webContents.once('did-finish-load', () => {
      getMainWindow().webContents.send('reply', { type: "theme_load", theme: "dark" });
      startSocketClient().catch(console.error);
    });
  }
}

export { MainApp };
