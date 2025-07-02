import { scrollToBottom } from './utils.js';

export function sendMessage() {
  const $input = $('#messageInput');
  const content = $input.val().trim();
  if (!content) return;

  const now = new Date();
  const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

  const message = { sender: user_id, content: content, time: time };

  window.electronAPI.sendMessage({
    type: "send_msg",
    chat_type: chat_select.type,
    chat_id: chat_select.id,
    message: message
  });

  const $chatItem = $(`[data-chat="${currentChatId}"]`);
  $chatItem.find('.last-message').text(content);
  $chatItem.find('.chat-time').text(time);

  $input.val('');
  scrollToBottom();
}
