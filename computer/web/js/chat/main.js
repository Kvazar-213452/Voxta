import { reconnectSocketClient } from './other.js';
import { getSettings } from './modal/settings.js';
import { selectChat } from './chat/chat.js';
import { sendMessage } from './chat/message.js';
import { loadTemplate } from './template.js';

loadTemplate();

if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
  reconnectSocketClient();
}

$(document).ready(function () {
  getSettings();

  $('#chatsList').on('click', '.chat-item', function () {
    const chatId = parseInt($(this).data('chat'));
    selectChat(chatId);
  });

  $('#sendBtn').click(sendMessage);
  $('#messageInput').keypress(function (e) {
    if (e.which === 13) sendMessage();
  });

  $('#searchInput').on('input', function () {
    const searchTerm = $(this).val().toLowerCase();
    $('.chat-item').each(function () {
      const chatName = $(this).find('.chat-name').text().toLowerCase();
      const lastMessage = $(this).find('.last-message').text().toLowerCase();
      $(this).toggle(chatName.includes(searchTerm) || lastMessage.includes(searchTerm));
    });
  });

  $('#settingsModal').click(function (e) {
    if (e.target === this) {
      closeSettings();
    }
  });
});
