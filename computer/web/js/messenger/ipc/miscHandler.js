import { updateSettingsUI } from '../modal/settings.js';
import { toggleTheme } from '../misc.js';
import { showUserNamePopup } from '../userFunc.js';
import { renderInfoChatSettings, opneModalAddFriendInChat } from '../modal/settingsChat.js';
import { renserUsersInAddFriendsModal } from '../modal/friends.js';

export function handleMisc(data) {
  if (data.type === 'theme_load' && data.theme === 'white') {
    toggleTheme();
  } else if (data.type === 'get_settings') {
    settings = data.settings;
    updateSettingsUI();
  } else if (data.type === 'get_user') {
    user = data.user;
    user_id = data.user.id;
  } else if (data.type === 'get_status_user') {
    console.log(data.status);
  } else if (data.type === 'info_user_profile') {
    showUserNamePopup(data.user, $(thisShowUserNamePopup), statusUserProfile);
  } else if (data.type === 'get_status_user_profile') {
    statusUserProfile = data.status;
    
    window.electronAPI.sendMessage({
      type: 'get_info_user', 
      id: selectIdUserProfile,
      _type: 'profile'
    });
  } else if (data.type === 'chat_settings_load') {
    renderInfoChatSettings(data.chat);
    
    $('#settingsChatModal').addClass('active');
  } else if (data.type === 'add_friend_in_chat_web') {
    opneModalAddFriendInChat(data.friends);
  } else if (data.type === 'finded_friend_web') {
    renserUsersInAddFriendsModal(data.users);
  }
}
