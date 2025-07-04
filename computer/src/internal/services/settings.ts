import { getSettings, Settings, saveSettings } from '../models/sqliteStorage/serviseUtils/settings';
import { getMainWindow } from '../models/mainWindow';

export function returnSettings() {
  let settings = getSettings();
      
  getMainWindow().webContents.send('reply', {
    type: "get_settings",
    settings: settings
  });
}

export function saveSettingsFix(settings: Settings) {
  saveSettings(settings);

  getMainWindow().webContents.send('reply', {
    type: "get_settings",
    settings: settings
  });
}
