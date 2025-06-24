function toggleSetting(key, toggle) {
  $(toggle).toggleClass('active');
  settings[key] = $(toggle).hasClass('active');
}

function toggleDarkMode() {
  toggleSetting('darkMode', event.target);
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

function changeLanguage(language) {
  settings.language = language;
}

function toggleReadReceipts() {
  toggleSetting('readReceipts', event.target);
}

function toggleOnlineStatus() {
  toggleSetting('onlineStatus', event.target);
}

function resetSettings() {
  if (confirm('Ви впевнені, що хочете скинути всі налаштування?')) {
    const defaults = [true, true, false, false, true, false, true, true, true];
    $('.toggle-switch').each(function (i) {
      $(this).toggleClass('active', defaults[i]);
    });
    $('select[onchange="changeLanguage(this.value)"]').val('uk');
    alert('Налаштування скинуто до значень за замовчуванням');
  }
}

function openSuccessModal() {
  $('#successModal').addClass('active');
}

function closeSuccessModal() {
  $('#successModal').removeClass('active');
}

function saveSettings() {
  closeSettings();

  setTimeout(() => {
      openSuccessModal();
  }, 200);
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

function toggleTheme() {
  const root = document.documentElement;

  if (root.getAttribute('data-theme') === 'light') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', 'light');
  }
}

// changeFontSize