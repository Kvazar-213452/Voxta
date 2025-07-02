export function scrollToBottom() {
  const $container = $('#messagesContainer');
  $container.scrollTop($container.prop('scrollHeight'));
}

export function findChatIndex(chats, chat_id) {
  for (const index in chats) {
    if (chat_id.includes(chats[index].id)) {
      return index;
    }
  }
  return null;
}
