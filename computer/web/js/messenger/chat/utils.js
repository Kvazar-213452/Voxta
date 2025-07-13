export function scrollToBottom() {
  const $container = $('#messagesContainer');
  $container.scrollTop($container.prop('scrollHeight'));
}

export function findChatIndex(chats, chatId) {
  for (const index in chats) {
    if (chatId.includes(chats[index].id)) {
      return index;
    }
  }
  return null;
}
