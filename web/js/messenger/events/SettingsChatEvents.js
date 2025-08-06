import {
  showSettingsChat,
  closeSettingsChat,
  saveSettingsChat,
  closeSettingsChatAddMember,
  findUser
} from '../modal/settingsChat.js';

$(document).ready(function () {
  $('#openModelSettingChatBtn').on('click', showSettingsChat);
  $('#closeModelSettingChatBtn').on('click', closeSettingsChat);
  $('#saveSetingsChatBtn').on('click', saveSettingsChat);
  $('#closeUsersModalAdd').on('click', closeSettingsChatAddMember);

  $('#input_find_user').on('keydown', function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      findUser($(this).val());
    }
  });
});
