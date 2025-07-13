import { getSettings, saveSettings } from '../models/sqliteStorage/serviseUtils/settings';
import { getMainWindow } from '../models/mainWindow';

export function returnSettings(): void {
  let settings = getSettings();
      
  getMainWindow().webContents.send('reply', {
    type: "get_settings",
    settings: settings
  });
}

export function saveSettingsFix(settings: Settings): void {
  saveSettings(settings);

  getMainWindow().webContents.send('reply', {
    type: "get_settings",
    settings: settings
  });
}
