function updateChatsList() {
  const $chatsList = $('#chatsList');
  $chatsList.empty();
  
  $.each(chats, function(index, chat) {
    const $chatItem = $(`
      <div class="chat-item" data-chat="${index}">
        <img class="avatar" src="${chat.avatar}">
        <div class="chat-info">
          <div class="chat-name">${chat.name}</div>
          <div class="last-message">Click to load messages...</div>
        </div>
        <div class="chat-time"></div>
      </div>
    `);
    $chatsList.append($chatItem);
  });
}

function selectChatByIndex(chatIndex) {
  if (chats[chatIndex]) {
    
    selectChat(chatIndex);
    return true;
  } else {
    return false;
  }
}

function load_chats(chatsData) {
  const chatList = {};
  let index = 1;

  $.each(chatsData, function(chatId, chatData) {
    chatList[index] = {
      name: chatData.name,
      avatar: chatData.avatar,
      id: chatId,
      type: chatData.type,
      participants: chatData.participants
    };
    index++;
  });

  console.log('Loaded chats:', chatList);

  chats = chatList;

  updateChatsList();
}

