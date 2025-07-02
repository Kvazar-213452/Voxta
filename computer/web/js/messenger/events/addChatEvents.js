import {
  showAddChat,
  closeAddChat
} from '../modal/addChat.js';

$(document).ready(function () {
  $('#showAddChatBtn').on('click', showAddChat);
  $('#closeAddChatBtn').on('click', closeAddChat);
});
