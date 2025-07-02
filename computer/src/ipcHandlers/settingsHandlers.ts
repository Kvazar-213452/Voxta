import { returnSettings, saveSettingsFix } from '../internal/services/settings';

export function handleSettings(msg: any): boolean {
  if (msg.type === 'get_settings') {
    returnSettings();
    return true;
  } else if (msg.type === 'save_settings') {
    saveSettingsFix(msg.settings);
    return true;
  }
  return false;
}
