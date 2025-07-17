import {
  showSettingsChat,
  closeSettingsChat,
  saveSettingsChat,
  closeSettingsChatAddMember
} from '../modal/settingsChat.js';

$(document).ready(function () {
  $('#openModelSettingChatBtn').on('click', showSettingsChat);
  $('#closeModelSettingChatBtn').on('click', closeSettingsChat);
  $('#saveSetingsChatBtn').on('click', saveSettingsChat);
  $('#closefriendsModalAdd').on('click', closeSettingsChatAddMember);
});
