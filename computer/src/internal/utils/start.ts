import { getMainWindow } from '../models/mainWindow';
import { getToken, deleteToken, getUser } from '../models/storage_app';
import { generate_key } from './crypto_func';
import { login_to_jwt } from '../services/authentication';

async function check_app() {
  // await deleteToken();
  const tokenExists = await getToken();
  const userExists = await getUser();
  const mainWindow = getMainWindow();

  const first_parse = JSON.parse(userExists!);
  const user_json = JSON.parse(first_parse);

  if (!tokenExists || !user_json["_id"]) {
    await generate_key();

    if (mainWindow) {
      mainWindow.loadFile('web/login.html');
    } else {
      throw new Error('Main window is not initialized');
    }
  } else {
    login_to_jwt();
  }
}

export { check_app };
