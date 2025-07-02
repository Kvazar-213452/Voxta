export function toggleSetting(key, toggle) {
  $(toggle).toggleClass('active');
  settings[key] = $(toggle).hasClass('active');
}

export function toggleDarkMode(event) {
  toggleSetting('darkMode', event.target);
}

export function toggleBrowserNotifications(event) {
  toggleSetting('browserNotifications', event.target);
  if (settings.browserNotifications && 'Notification' in window) {
    Notification.requestPermission();
  }
}

export function toggleDoNotDisturb(event) {
  toggleSetting('doNotDisturb', event.target);
}

export function changeLanguage(language) {
  settings.language = language;
}

export function toggleReadReceipts(event) {
  toggleSetting('readReceipts', event.target);
}

export function toggleOnlineStatus(event) {
  toggleSetting('onlineStatus', event.target);
}

export function resetSettings() {
  settings = { ...defaultSettings };
  updateSettingsUI();
}

export function openSuccessModal() {
  $('#successModal').addClass('active');
}

export function closeSuccessModal() {
  $('#successModal').removeClass('active');
}

export function saveSettings() {
  closeSettings();
  saveSettingsApp();

  setTimeout(() => {
    openSuccessModal();
  }, 200);
}

export function showSettings() {
  $('#settingsModal').addClass('active');
}

export function closeSettings() {
  $('#settingsModal').removeClass('active');
}

export function logout() {
  if (confirm('Ви впевнені, що хочете вийти?')) {
    alert('Вихід з системи...');
  }
}

export function toggleTheme() {
  const root = document.documentElement;
  if (root.getAttribute('data-theme') === 'light') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', 'light');
  }
}

export function getSettings() {
  window.electronAPI.sendMessage({
    type: "get_settings"
  });
}

export function saveSettingsApp() {
  window.electronAPI.sendMessage({
    type: "save_settings",
    settings: settings
  });
}

export function updateSettingsUI() {
  $('.toggle-switch[data-setting]').each(function () {
    const key = $(this).attr('data-setting');
    const isActive = !!settings[key];
    $(this).toggleClass('active', isActive);
  });

  $('select[onchange="changeLanguage(this.value)"]').val(settings.language);
}
