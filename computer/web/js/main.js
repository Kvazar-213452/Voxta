let chats = {};

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
  
  // Log the chat ID to console when clicked
  const chat = chats[chatId];
  if (chat) {
    console.log('Selected chat ID:', chat.id);
  }
  
  loadChat(chatId);
}

function loadChat(chatId) {
  const chat = chats[chatId];
  if (!chat) return;

  $('#currentChatName').text(chat.name);
  
  // Since we don't have status in the new structure, we can use a default or empty
  $('#onlineStatus').text(''); // or use a default status
  $('.chat-header .avatar').attr('src', chat.avatar);

  const $container = $('#messagesContainer');
  $container.empty();
  
  // Since messages are loaded separately now, we'll just clear the container
  // Messages will be loaded via separate mechanism
  scrollToBottom();
}

function addMessageToChat(message, isNew = true) {
  const chat = chats[currentChatId];
  if (!chat) return;
  
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
  
  // Since we don't store messages in the chat object anymore, 
  // we'll just add it to the UI
  addMessageToChat(message, true);

  const $chatItem = $(`[data-chat="${currentChatId}"]`);
  $chatItem.find('.last-message').text(content);
  $chatItem.find('.chat-time').text(time);

  $input.val('');
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

window.electronAPI.onMessage((data) => {
  if (data.type === "load_chats") {
    load_chats(data.chats);
    selectChatByIndex(1);
  }
});
