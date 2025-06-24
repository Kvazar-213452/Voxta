window.electronAPI.onMessage((data) => {
  if (data.type === "load_chats") {
    load_chats(data.chats);
    selectChatByIndex(1);
  } else if (data.type === "load_chat_content") {
    loadChat(data.content, data.chat_id);
  } else if (data.type === "get_user") {
    user = data.user;
    user_id = data.user._id;
  } else if (data.type === "came_chat_msg") {
    if (data.chat_id === chat_id_select) {
      addMessageToChat(data.message, true);
    } else {
      let index = findChatIndex(chats, data.chat_id);
      highlightChatById(index);
    }
  }
});


function findChatIndex(chats, chat_id) {
    for (const index in chats) {
        if (chat_id.includes(chats[index].id)) {
            return index;
        }
    }
    return null;
}


function highlightChatById(val) {
  const $container = $('.chats-list');
  const $el = $container.find(`[data-chat="${val}"]`);

  $container.find('[data-chat]').css("border", "none");

  if ($el.length > 0) {
    $el.css("border", "2px solid red");
  } else {
    console.warn("Елемент з таким data-chat не знайдено:", val);
  }
}

