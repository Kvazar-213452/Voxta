import { scrollToBottom } from './utils.js';

export function sendMessage() {
  const $input = $('#messageInput');
  const content = $input.val()?.toString().trim();
  if (!content) return;

  const now = new Date();
  const time =
    now.getHours().toString().padStart(2, '0') + ':' +
    now.getMinutes().toString().padStart(2, '0');

  const message = {
    sender: window.AppData.user_id,
    content: content,
    time: time
  };

  window.electronAPI.sendMessage({
    type: 'send_msg',
    chat_type: window.AppData.chat_select.type,
    chat_id: window.AppData.chat_select.id,
    message: message
  });

  const $chatItem = $(`[data-chat="${window.AppData.currentChatId}"]`);
  $chatItem.find('.last-message').text(content);
  $chatItem.find('.chat-time').text(time);

  $input.val('');
  scrollToBottom();
}
