import { reconnectSocketClient } from './misc.js';
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

  $('#chatsList').on('click', '.chat-item', function (this: HTMLElement) {
    const chatId = parseInt($(this).data('chat'));
    selectChat(chatId);
  });

  $('#sendBtn').click(sendMessage);
  $('#messageInput').keypress(function (e) {
    if (e.which === 13) sendMessage();
  });

  $('#searchInput').on('input', function (this: HTMLInputElement) {
    const searchTerm = $(this).val()!.toString().toLowerCase();

    $('.chat-item').each(function (this: HTMLElement) {
      const chatName = $(this).find('.chat-name').text().toLowerCase();
      const lastMessage = $(this).find('.last-message').text().toLowerCase();
      $(this).toggle(chatName.includes(searchTerm) || lastMessage.includes(searchTerm));
    });
  });

  // $('#settingsModal').click(function (this: HTMLElement, e) {
  //   if (e.target === this) {
  //     closeSettings();
  //   }
  // });
});

// window.electronAPI.sendMessage({
//   type: "get_status_user", 
//   user_id: "1243243423",
// });
