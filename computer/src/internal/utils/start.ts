import { getMainWindow } from '../models/mainWindow';
import { getToken } from '../models/storage_app';
import { generate_key } from './crypto_func';

async function check_app() {
  const tokenExists = await getToken();
  const mainWindow = getMainWindow();

  if (!tokenExists) {
    await generate_key();
    if (mainWindow) {
      mainWindow.loadFile('web/login.html');
    } else {
      throw new Error('Main window is not initialized');
    }
  }
}

export { check_app };
