$(document).ready(function () {
  loadChat(currentChatId);

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







function selectChat(chatId) {
  $('.chat-item').removeClass('active');
  $(`[data-chat="${chatId}"]`).addClass('active');
  currentChatId = chatId;

  const chat = chats[chatId];

  if (chat) {
    window.electronAPI.sendMessage({
      type: "load_chat", 
      id: chat.id, 
      type_chat: chat.type
    });
  }
}

function loadChat(content, chat_id) {
  let chat = null;
  let chatIndex = null;
  
  for (let index in chats) {
    if (chats[index].id === chat_id) {
      chat = chats[index];
      chatIndex = index;
      break;
    }
  }
  
  if (!chat) {
    console.log('Chat not found with ID:', chat_id);
    return;
  }
  
  chat_select = chat;
  chat_id_select = chat.id;
  console.log('Found chat:', chat);
  
  $('#currentChatName').text(chat.name);
  $('#onlineStatus').text('');
  $('.chat-header .avatar').attr('src', chat.avatar);
  
  const $container = $('#messagesContainer');
  $container.empty();
  
  if (content && Array.isArray(content)) {
    content.forEach(message => {
      const isOwnMessage = message.sender === user_id;
      const $msgDiv = $('<div>', { 
        class: `message ${isOwnMessage ? 'own' : ''}` 
      });
      
      if (isOwnMessage) {
        $msgDiv.html(`
          <div>
            <div class="message-content">${message.content}</div>
            <div class="message-time">${message.time}</div>
          </div>
        `);
      } else {
        $msgDiv.html(`
          <div class="avatar">${chat.avatar}</div>
          <div>
            <div class="message-content">${message.content}</div>
            <div class="message-time">${message.time}</div>
            <div class="message-sender">Sender: ${message.sender}</div>
          </div>
        `);
      }
      
      $container.append($msgDiv);
    });
  }
  
  currentChatId = parseInt(chatIndex);

  $('.chat-item').removeClass('active');
  $(`[data-chat="${chatIndex}"]`).addClass('active');

  loadInfoPanel(chat);
  scrollToBottom();
}

function addMessageToChat(message, isNew = true) {
  const chat = chats[currentChatId];
    console.log(chat)
  if (!chat) return;
  
  const $msgDiv = $('<div>', { class: `message ${message.sender === user_id ? 'own' : ''}` });

  if (message.sender === user_id) {
    $msgDiv.html(`
      <div>
        <div class="message-content">${message.content}</div>
        <div class="message-time">${message.time}</div>
      </div>
    `);
  } else {
    $msgDiv.html(`
      <div class="avatar">${chat.avatar}</div>
      <div>
        <div class="message-content">${message.content}</div>
        <div class="message-time">${message.time}</div>
      </div>
    `);
  }

  $('#messagesContainer').append($msgDiv);
  if (isNew) scrollToBottom();
}

function sendMessage() {
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
}

function scrollToBottom() {
  const $container = $('#messagesContainer');
  $container.scrollTop($container.prop('scrollHeight'));
}

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

  chats = chatList;

  updateChatsList();
}


// unix function
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



if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
  reconnectSocketClient()
}

function reconnectSocketClient() {
  window.electronAPI.sendMessage({
    type: "reconnect_socket_client"
  });
}

// user-info-panel