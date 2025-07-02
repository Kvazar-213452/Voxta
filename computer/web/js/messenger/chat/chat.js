import { scrollToBottom } from './utils.js';
import { loadInfoPanel } from '../infoPanel.js';

export function selectChat(chatId) {
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

export function loadChat(content, chat_id, participants) {
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
          <img 
            class="avatar info_profile_bnt" 
            src="${participants[message.sender]["avatar"]}" 
            data-user-id="${message.sender}"
          >
          <div>
            <div class="message-sender info_profile_bnt">${participants[message.sender]["name"]}</div>
            <div class="message-content un_unser">${message.content}</div>
            <div class="message-time un_unser_time">${message.time}</div>
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

export function addMessageToChat(message, isNew = true) {
  const chat = chats[currentChatId];
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

export function updateChatsList() {
  const $chatsList = $('#chatsList');
  $chatsList.empty();

  $.each(chats, function (index, chat) {
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

export function load_chats(chatsData) {
  const chatList = {};
  let index = 0;

  $.each(chatsData, function (chatId, chatData) {
    chatList[index] = {
      name: chatData.name,
      avatar: chatData.avatar,
      id: chatId,
      type: chatData.type,
      participants: chatData.participants,
      createdAt: chatData.createdAt,
      desc: chatData.desc || "",
      owner: chatData.owner || ""
    };
    index++;
  });

  chats = chatList;
  updateChatsList();
}

export function addChats(chatsData) {
  chats[index] = {
    name: chatsData.name,
    avatar: chatsData.avatar,
    id: chatsData.id,
    type: chatsData.type,
    participants: chatsData.participants,
    createdAt: chatsData.createdAt,
    desc: chatsData.desc || "",
    owner: chatsData.owner || ""
  };
  updateChatsList();
}

export function highlightChatById(val) {
  const $container = $('.chats-list');
  const $el = $container.find(`[data-chat="${val}"]`);

  $container.find('[data-chat]').css("border", "none");

  if ($el.length > 0) {
    $el.css("border", "2px solid red");
  } else {
    console.warn("Елемент з таким data-chat не знайдено:", val);
  }
}
