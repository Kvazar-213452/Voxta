import {
  closeSettings,
  toggleDarkMode,
  toggleBrowserNotifications,
  toggleDoNotDisturb,
  toggleReadReceipts,
  toggleOnlineStatus,
  logout,
  resetSettings,
  saveSettings,
  closeSuccessModal,
  changeLanguage,

  showSettings
} from '../modal/settings.js';

$(document).ready(function () {
  $('#closeSettingsBtn').on('click', closeSettings);
  $('#toggleDarkMode').on('click', toggleDarkMode);
  $('#toggleBrowserNotifications').on('click', toggleBrowserNotifications);
  $('#toggleDoNotDisturb').on('click', toggleDoNotDisturb);
  $('#toggleReadReceipts').on('click', toggleReadReceipts);
  $('#toggleOnlineStatus').on('click', toggleOnlineStatus);
  $('#changeLanguageSelect').on('change', function (this: HTMLSelectElement) {
    changeLanguage(this.value);
  });
  $('#logoutBtn').on('click', logout);
  $('#resetSettingsBtn').on('click', resetSettings);
  $('#saveSettingsBtn').on('click', saveSettings);
  $('#closeSuccessModalBtn').on('click', closeSuccessModal);

  $('#showSettingsBtn').on('click', showSettings);
});
