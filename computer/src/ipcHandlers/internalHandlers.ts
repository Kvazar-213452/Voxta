import { returnSettings, saveSettingsFix } from '../internal/settings';
import { getInfoChat } from '../services/chat/utils/getInfo';
import { delFriend, findFriend, adddFriend } from '../services/chat/utils/friend';

export function handleInternal(msg: any): boolean {
  if (msg.type === 'get_settings') {
    returnSettings();
    return true;
  } else if (msg.type === 'save_settings') {
    saveSettingsFix(msg.settings);
    return true;
  } else if (msg.type === 'load_chat_info_for_settings') {
    getInfoChat(msg.id, 'settings_chat', msg.typeChat);
    return true;
  } else if (msg.type === 'del_friend') {
    delFriend(msg.id);
    return true;
  } else if (msg.type === 'find_friend') {
    findFriend(msg.name);
    return true;
  } else if (msg.type === 'add_friend') {
    adddFriend(msg.id);
    return true;
  } 

  return false;
}
