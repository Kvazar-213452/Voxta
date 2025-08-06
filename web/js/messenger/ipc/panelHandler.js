import { renderUserOnInfoPanel, renderNameInInfoPanel } from '../infoPanel.js';
import { renderUsersInChatSettings, renderUserChatSettings } from '../modal/settingsChat.js';

export function handlePanel(data) {
  if (data.type === 'info_users') {
    renderUserOnInfoPanel(data.users);
  } else if (data.type === 'info_user') {
    renderNameInInfoPanel(data.user);
  } else if (data.type === 'chat_settings') {
    renderUsersInChatSettings(data.users);
  } else if (data.type === 'chat_settings_admin_web') {
    renderUserChatSettings(data.user)
  }
}
