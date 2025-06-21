const chats = {
  1: {
    name: "Анна Мельник",
    avatar: "АМ",
    status: "онлайн",
    messages: [
      { sender: "other", content: "Привіт! Як справи? Давно не бачились!", time: "14:30" },
      { sender: "own", content: "Привіт! Все добре, дякую. А у тебе як?", time: "14:31" },
      { sender: "other", content: "Теж все чудово! Хочеш зустрітись на каві цими вихідними?", time: "14:32" }
    ]
  },
  2: {
    name: "Петро Коваленко",
    avatar: "ПК",
    status: "онлайн",
    messages: [
      { sender: "other", content: "Привіт! Не забудь про нашу зустріч", time: "13:40" },
      { sender: "own", content: "Звичайно! О котрій?", time: "13:42" },
      { sender: "other", content: "Зустрічаємось завтра о 15:00", time: "13:45" }
    ]
  }
};

let currentChatId = 1;
let settings = {
  darkMode: true,
  primaryColor: '#58ff7f',
  fontSize: 'medium',
  soundNotifications: true,
  browserNotifications: false,
  doNotDisturb: false,
  autoReplies: true,
  autoReplySpeed: 2,
  language: 'uk',
  readReceipts: true,
  onlineStatus: true,
  chatHistory: true
};

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
  loadChat(chatId);
}

function loadChat(chatId) {
  const chat = chats[chatId];
  if (!chat) return;

  $('#currentChatName').text(chat.name);
  $('#onlineStatus').text(chat.status);
  $('.chat-header .avatar').text(chat.avatar);

  const $container = $('#messagesContainer');
  $container.empty();
  chat.messages.forEach(msg => addMessageToChat(msg, false));
  scrollToBottom();
}

function addMessageToChat(message, isNew = true) {
  const chat = chats[currentChatId];
  const $msgDiv = $('<div>', { class: `message ${message.sender === 'own' ? 'own' : ''}` });

  if (message.sender === 'own') {
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

  const message = { sender: 'own', content: content, time: time };
  chats[currentChatId].messages.push(message);
  addMessageToChat(message, true);

  const $chatItem = $(`[data-chat="${currentChatId}"]`);
  $chatItem.find('.last-message').text(content);
  $chatItem.find('.chat-time').text(time);

  $input.val('');

  if (settings.autoReplies) {
    setTimeout(simulateResponse, settings.autoReplySpeed * 1000);
  }
}

function simulateResponse() {
  const responses = [
    "Цікаво!", "Зрозуміло 👍", "Дякую за інформацію", "Добре, домовились",
    "Гарна ідея!", "Можна детальніше?", "Звучить чудово!"
  ];

  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  const now = new Date();
  const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

  const message = { sender: 'other', content: randomResponse, time: time };
  chats[currentChatId].messages.push(message);
  addMessageToChat(message, true);

  const $chatItem = $(`[data-chat="${currentChatId}"]`);
  $chatItem.find('.last-message').text(randomResponse);
  $chatItem.find('.chat-time').text(time);
}

function scrollToBottom() {
  const $container = $('#messagesContainer');
  $container.scrollTop($container.prop('scrollHeight'));
}

function showSettings() {
  $('#settingsModal').addClass('active');
}

function closeSettings() {
  $('#settingsModal').removeClass('active');
}

function logout() {
  if (confirm('Ви впевнені, що хочете вийти?')) {
    alert('Вихід з системи...');
  }
}

// Settings
function toggleSetting(key, toggle) {
  $(toggle).toggleClass('active');
  settings[key] = $(toggle).hasClass('active');
}

function toggleDarkMode() {
  toggleSetting('darkMode', event.target);
}

function changePrimaryColor(color) {
  document.documentElement.style.setProperty('--primary-color', color);
  settings.primaryColor = color;
}

function changeFontSize(size) {
  const sizes = { small: '12px', medium: '14px', large: '16px' };
  document.documentElement.style.fontSize = sizes[size];
  settings.fontSize = size;
}

function toggleSoundNotifications() {
  toggleSetting('soundNotifications', event.target);
}

function toggleBrowserNotifications() {
  toggleSetting('browserNotifications', event.target);
  if (settings.browserNotifications && 'Notification' in window) {
    Notification.requestPermission();
  }
}

function toggleDoNotDisturb() {
  toggleSetting('doNotDisturb', event.target);
}

function toggleAutoReplies() {
  toggleSetting('autoReplies', event.target);
}

function changeAutoReplySpeed(speed) {
  settings.autoReplySpeed = parseInt(speed);
}

function changeLanguage(language) {
  settings.language = language;
}

function toggleReadReceipts() {
  toggleSetting('readReceipts', event.target);
}

function toggleOnlineStatus() {
  toggleSetting('onlineStatus', event.target);
}

function toggleChatHistory() {
  toggleSetting('chatHistory', event.target);
}

function resetSettings() {
  if (confirm('Ви впевнені, що хочете скинути всі налаштування?')) {
    const defaults = [true, true, false, false, true, false, true, true, true];
    $('.toggle-switch').each(function (i) {
      $(this).toggleClass('active', defaults[i]);
    });
    $('.color-picker').val('#58ff7f');
    $('select[onchange="changeFontSize(this.value)"]').val('medium');
    $('input[type="number"]').val('2');
    $('select[onchange="changeLanguage(this.value)"]').val('uk');
    changePrimaryColor('#58ff7f');
    changeFontSize('medium');
    alert('Налаштування скинуто до значень за замовчуванням');
  }
}

function saveSettings() {
  alert('Налаштування збережено успішно!');
  closeSettings();
}


window.electronAPI.onMessage((msg) => {
    console.log('Відповідь від сервера:', msg);
});
