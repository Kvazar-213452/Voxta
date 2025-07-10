import {
  showSettingsChat,
  closeSettingsChat
} from '../modal/settingsChat.js';

$(document).ready(function () {
  $('#openModelSettingChatBtn').on('click', showSettingsChat);
  $('#closeModelSettingChatBtn').on('click', closeSettingsChat);
});
