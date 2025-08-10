import {
  showSettingsChat,
  closeSettingsChat,
  saveSettingsChat
} from '../modal/settingsChat.js';

$(document).ready(function () {
  $('#openModelSettingChatBtn').on('click', showSettingsChat);
  $('#closeModelSettingChatBtn').on('click', closeSettingsChat);
  $('#saveSetingsChatBtn').on('click', saveSettingsChat);
});
