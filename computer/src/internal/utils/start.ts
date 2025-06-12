import { getMainWindow } from '../models/mainWindow';
import { getToken, deleteToken } from '../models/storage_app';
import { generate_key } from './crypto_func';
import { login_to_jwt } from '../services/authentication';

async function check_app() {
  // await deleteToken();
  const tokenExists = await getToken();
  const mainWindow = getMainWindow();

  if (!tokenExists) {
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
