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
