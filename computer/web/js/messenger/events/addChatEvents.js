import {
  showAddChat,
  closeAddChat,

  closeServerModalChatAdd,
  createServerChat
} from '../modal/addChat.js';

$(document).ready(function () {
  $('#showAddChatBtn').on('click', showAddChat);
  $('#closeAddChatBtn').on('click', closeAddChat);

  $('.closeServerModalChatAdd').on('click', closeServerModalChatAdd);
  $('#createServerChatBtn').on('click', createServerChat);
});
