import { renderUserOnInfoPanel, renderNameInInfoPanel } from '../infoPanel.js';
import { renderUsersInChatSettings, renderUserChatSettings, opneModalAddFriendInChatRender } from '../modal/settingsChat.js';
import { renderFriends } from '../modal/friends.js';

export function handlePanel(data) {
  if (data.type === 'info_users') {
    renderUserOnInfoPanel(data.users);
  } else if (data.type === 'info_user') {
    renderNameInInfoPanel(data.user);
  } else if (data.type === 'chat_settings') {
    renderUsersInChatSettings(data.users);
  } else if (data.type === 'chat_settings_admin_web') {
    renderUserChatSettings(data.user)
  } else if (data.type === 'friends_modal') {
    window.electronAPI.sendMessage({
      type: 'get_info_users',
      _type: 'friends_modal_render',
      users: data.friends
    });
  } else if (data.type === 'friends_modal_render') {
    renderFriends(data.friends);
  } else if (data.type === 'friends_add_chat_modal_render') {
    opneModalAddFriendInChatRender(data.friends);
  }
}
