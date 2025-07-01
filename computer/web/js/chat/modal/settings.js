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
  settings = {...defaultSettings};

  updateSettingsUI();
}

function openSuccessModal() {
  $('#successModal').addClass('active');
}

function closeSuccessModal() {
  $('#successModal').removeClass('active');
}

function saveSettings() {
  closeSettings();
  saveSettingsApp();

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

function getSettings() {
  window.electronAPI.sendMessage({
    type: "get_settings"
  });
}

function saveSettingsApp() {
  window.electronAPI.sendMessage({
    type: "save_settings",
    settings: settings
  });
}

function updateSettingsUI() {
  $('.toggle-switch[data-setting]').each(function () {
    const key = $(this).attr('data-setting');
    const isActive = !!settings[key];
    $(this).toggleClass('active', isActive);
  });

  $('select[onchange="changeLanguage(this.value)"]').val(settings.language);
}

// showSettings