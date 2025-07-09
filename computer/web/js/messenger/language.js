const addChatLang = {
  modal_title_create_chat: "💬 Створити чат",
  modal_close_button: "×",
  label_chat_avatar: "Аватар чату",
  avatar_label_icon: "📷",
  avatar_label_text: "Оберіть зображення для аватару",
  form_hint_avatar_formats: "Підтримуються формати: JPG, PNG, GIF (макс. 5MB)",
  label_chat_name: "Назва чату *",
  placeholder_chat_name: "Введіть назву чату...",
  form_hint_chat_name: "Оберіть зрозумілу назву для вашого чату",
  label_chat_description: "Опис чату",
  placeholder_chat_description: "Опишіть тему або мету чату...",
  form_hint_chat_description: "Короткий опис допоможе іншим зрозуміти тему чату",
  label_privacy: "Приватність",
  privacy_option_private_icon: "🔒",
  privacy_option_private_name: "Приватний",
  privacy_option_public_icon: "🌐",
  privacy_option_public_name: "Публічний",
  form_hint_privacy: "Приватні чати видимі тільки вам",
  modal_btn_cancel: "Скасувати",
  modal_btn_create_chat: "Створити чат",
};

const settingsChatLang = {
  modal_title_settings_chat: "⚙️ Налаштування чату",
  modal_close_button_chat: "×",

  label_messages: "Повідомлення",
  toggle_sounds_name: "Звуки повідомлень",
  toggle_sounds_desc: "Відтворювати звук при отриманні нових повідомлень",
  toggle_typing_name: "Попередження про друк",
  toggle_typing_desc: "Показувати коли хтось друкує повідомлення",
  toggle_timestamps_name: "Часові мітки",
  toggle_timestamps_desc: "Показувати час відправки повідомлень",

  label_privacy: "Приватність",
  toggle_online_status_name: "Статус онлайн",
  toggle_online_status_desc: "Показувати ваш статус активності іншим",
  toggle_read_receipts_name: "Підтвердження прочитання",
  toggle_read_receipts_desc: "Показувати галочки про прочитання повідомлень",

  label_auto_delete: "Автовидалення повідомлень",
  option_auto_delete_never: "Ніколи",
  option_auto_delete_24h: "Через 24 години",
  option_auto_delete_7d: "Через 7 днів",
  option_auto_delete_30d: "Через 30 днів",
  option_auto_delete_1y: "Через 1 рік",
  form_hint_auto_delete: "Повідомлення будуть автоматично видалені через вибраний час",

  label_background_image: "Фон чату",
  option_bg_default: "За замовчуванням",
  option_bg_gradient1: "Градієнт 1",
  option_bg_gradient2: "Градієнт 2",
  option_bg_pattern1: "Візерунок 1",
  option_bg_pattern2: "Візерунок 2",
  option_bg_custom: "Власне зображення",
  form_hint_bg: "Налаштуйте фон для області повідомлень",

  modal_btn_reset: "Скинути",
  modal_btn_cancel: "Скасувати",
  modal_btn_save: "Зберегти"
};

const settingsLang = {
  modal_title_settings: "⚙️ Налаштування",
  modal_close_button: "×",

  settings_group_appearance: "🎨 Зовнішній вигляд",
  settings_label_dark_theme: "Темна тема",
  settings_desc_dark_theme: "Використовувати темну тему оформлення",

  settings_group_notifications: "🔔 Сповіщення",
  settings_label_browser_notifications: "Браузерні сповіщення",
  settings_desc_browser_notifications: "Показувати сповіщення в браузері",
  settings_label_do_not_disturb: 'Режим "Не турбувати"',
  settings_desc_do_not_disturb: "Вимкнути всі сповіщення",

  settings_group_chat: "💬 Чат",
  settings_label_interface_language: "Мова інтерфейсу",
  settings_desc_interface_language: "Вибрати мову додатка",
  option_language_uk: "Українська",
  option_language_en: "English",

  settings_group_privacy: "🔒 Приватність",
  settings_label_read_receipts: "Читання повідомлень",
  settings_desc_read_receipts: "Показувати коли повідомлення прочитане",
  settings_label_online_status: "Статус онлайн",
  settings_desc_online_status: "Показувати коли ви онлайн",

  modal_btn_logout: "Вихід",
  modal_btn_reset: "Скинути",
  modal_btn_save: "Зберегти",

  success_modal_title: "Voxta",
  success_message: "Налаштування збережено успішно!<br>Всі зміни застосовано.",
  success_btn_done: "Готово"
};

export const langUA = {
  title_name: "Voxta",
  search_placeholder: "Пошук чатів...",
  message_input_placeholder: "Напишіть повідомлення...",
  send_button: "▶",
  settings_icon: "⚙️",
  user_offline_last_seen: "Останній раз: 2 хв тому",
  section_title_profile_chat_users: "Користувачі",
  section_title_profile_chat_desc: "Опис",
  section_title_profile_chat_info: "Інформація",
  info_label_users: "Учасники",
  info_label_registration_date: "Дата реєстрації",
  info_label_type: "Тип",
  info_label_owner: "Власник",
  ...addChatLang,
  ...settingsLang,
  ...settingsChatLang,
};




export function loadLang(lang) {
  // Існуючий код для основного інтерфейсу
  $(".title_name").text(lang.title_name);
  $("#searchInput").attr("placeholder", lang.search_placeholder);
  $("#messageInput").attr("placeholder", lang.message_input_placeholder);
  $("#sendBtn").text(lang.send_button);
  $(".settings-icon").text(lang.settings_icon);
  $(".user-email-offline").text(lang.user_offline_last_seen);
  $("#section_title_profile_chat_users").text(lang.section_title_profile_chat_users);
  $("#section_title_profile_chat_desc").text(lang.section_title_profile_chat_desc);
  $(".section-title").filter(function () {
    return $(this).text() === "";
  }).first().text(lang.section_title_profile_chat_info);
  $(".info-item").eq(0).find(".info-label").text(lang.info_label_users);
  $(".info-item").eq(1).find(".info-label").text(lang.info_label_registration_date);
  $(".info-item").eq(2).find(".info-label").text(lang.info_label_type);
  $(".info-item").eq(3).find(".info-label").text(lang.info_label_owner);

  // Доповнення для модального вікна "Створити чат"
  $(".modal-title").text(lang.modal_title_create_chat);
  $(".modal-close").text(lang.modal_close_button);
  $(".chat-form-label[for='chatAvatar']").text(lang.label_chat_avatar);
  $("#avatarLabel > span:nth-child(1)").text(lang.avatar_label_icon);
  $("#avatarLabel > span:nth-child(2)").text(lang.avatar_label_text);
  $(".form-hint").filter((i, el) => $(el).text().includes("формати")).text(lang.form_hint_avatar_formats);

  $(".chat-form-label[for='chatName']").text(lang.label_chat_name);
  $("#chatName").attr("placeholder", lang.placeholder_chat_name);
  $(".form-hint").filter((i, el) => $(el).text().includes("зрозумілу назву")).text(lang.form_hint_chat_name);

  $(".chat-form-label[for='chatDescription']").text(lang.label_chat_description);
  $("#chatDescription").attr("placeholder", lang.placeholder_chat_description);
  $(".form-hint").filter((i, el) => $(el).text().includes("Короткий опис")).text(lang.form_hint_chat_description);

  $(".chat-form-label").filter(function () {
    return $(this).text() === "";
  }).first().text(lang.label_privacy);

  $(".privacy-option").eq(0).find(".privacy-icon").text(lang.privacy_option_private_icon);
  $(".privacy-option").eq(0).find(".privacy-name").text(lang.privacy_option_private_name);

  $(".privacy-option").eq(1).find(".privacy-icon").text(lang.privacy_option_public_icon);
  $(".privacy-option").eq(1).find(".privacy-name").text(lang.privacy_option_public_name);

  $(".form-hint").filter((i, el) => $(el).text().includes("Приватні чати")).text(lang.form_hint_privacy);

  $(".modal-btn-secondary#closeAddChatBtn").text(lang.modal_btn_cancel);
  $(".modal-btn-primary#createBtn").text(lang.modal_btn_create_chat);




  $("#settingsModal .modal-title").text(lang.modal_title_settings);
  $("#settingsModal .modal-close#closeSettingsBtn").text(lang.modal_close_button);

  const groups = $("#settingsModal .settings-group");

  $(groups[0]).find(".settings-group-title").text(lang.settings_group_appearance);
  $(groups[0]).find(".settings-label-text").eq(0).text(lang.settings_label_dark_theme);
  $(groups[0]).find(".settings-label-desc").eq(0).text(lang.settings_desc_dark_theme);

  $(groups[1]).find(".settings-group-title").text(lang.settings_group_notifications);
  $(groups[1]).find(".settings-label-text").eq(0).text(lang.settings_label_browser_notifications);
  $(groups[1]).find(".settings-label-desc").eq(0).text(lang.settings_desc_browser_notifications);
  $(groups[1]).find(".settings-label-text").eq(1).text(lang.settings_label_do_not_disturb);
  $(groups[1]).find(".settings-label-desc").eq(1).text(lang.settings_desc_do_not_disturb);

  $(groups[2]).find(".settings-group-title").text(lang.settings_group_chat);
  $(groups[2]).find(".settings-label-text").text(lang.settings_label_interface_language);
  $(groups[2]).find(".settings-label-desc").text(lang.settings_desc_interface_language);
  $("#changeLanguageSelect option[value='uk']").text(lang.option_language_uk);
  $("#changeLanguageSelect option[value='en']").text(lang.option_language_en);

  $(groups[3]).find(".settings-group-title").text(lang.settings_group_privacy);
  $(groups[3]).find(".settings-label-text").eq(0).text(lang.settings_label_read_receipts);
  $(groups[3]).find(".settings-label-desc").eq(0).text(lang.settings_desc_read_receipts);
  $(groups[3]).find(".settings-label-text").eq(1).text(lang.settings_label_online_status);
  $(groups[3]).find(".settings-label-desc").eq(1).text(lang.settings_desc_online_status);

  $(".modal-btn-logout#logoutBtn").text(lang.modal_btn_logout);
  $(".modal-btn-secondary#resetSettingsBtn").text(lang.modal_btn_reset);
  $(".modal-btn-primary#saveSettingsBtn").text(lang.modal_btn_save);

  $("#successModal .success-title").text(lang.success_modal_title);
  $("#successModal .success-message").html(lang.success_message);
  $("#successModal .success-btn#closeSuccessModalBtn").text(lang.success_btn_done);











    const modal = $("#settingsChatModal");

  modal.find(".modal-title").text(lang.modal_title_settings_chat);
  modal.find(".modal-close#closeModelSettingChatBtn").text(lang.modal_close_button_chat);

  const formGroups = modal.find(".chat-form-group");

  // Повідомлення
  $(formGroups[0]).find(".chat-form-label").text(lang.label_messages);

  const toggleOptionsMsgs = $(formGroups[0]).find(".toggle-option");
  $(toggleOptionsMsgs[0]).find(".toggle-name").text(lang.toggle_sounds_name);
  $(toggleOptionsMsgs[0]).find(".toggle-desc").text(lang.toggle_sounds_desc);
  $(toggleOptionsMsgs[1]).find(".toggle-name").text(lang.toggle_typing_name);
  $(toggleOptionsMsgs[1]).find(".toggle-desc").text(lang.toggle_typing_desc);
  $(toggleOptionsMsgs[2]).find(".toggle-name").text(lang.toggle_timestamps_name);
  $(toggleOptionsMsgs[2]).find(".toggle-desc").text(lang.toggle_timestamps_desc);

  // Приватність
  $(formGroups[1]).find(".chat-form-label").text(lang.label_privacy);

  const toggleOptionsPriv = $(formGroups[1]).find(".toggle-option");
  $(toggleOptionsPriv[0]).find(".toggle-name").text(lang.toggle_online_status_name);
  $(toggleOptionsPriv[0]).find(".toggle-desc").text(lang.toggle_online_status_desc);
  $(toggleOptionsPriv[1]).find(".toggle-name").text(lang.toggle_read_receipts_name);
  $(toggleOptionsPriv[1]).find(".toggle-desc").text(lang.toggle_read_receipts_desc);

  // Автовидалення повідомлень
  $(formGroups[2]).find(".chat-form-label").text(lang.label_auto_delete);
  $("#autoDeleteTime option[value='never']").text(lang.option_auto_delete_never);
  $("#autoDeleteTime option[value='24h']").text(lang.option_auto_delete_24h);
  $("#autoDeleteTime option[value='7d']").text(lang.option_auto_delete_7d);
  $("#autoDeleteTime option[value='30d']").text(lang.option_auto_delete_30d);
  $("#autoDeleteTime option[value='1y']").text(lang.option_auto_delete_1y);
  $(formGroups[2]).find(".form-hint").text(lang.form_hint_auto_delete);

  // Фон чату
  $(formGroups[3]).find(".chat-form-label").text(lang.label_background_image);
  $("#backgroundImage option[value='default']").text(lang.option_bg_default);
  $("#backgroundImage option[value='gradient1']").text(lang.option_bg_gradient1);
  $("#backgroundImage option[value='gradient2']").text(lang.option_bg_gradient2);
  $("#backgroundImage option[value='pattern1']").text(lang.option_bg_pattern1);
  $("#backgroundImage option[value='pattern2']").text(lang.option_bg_pattern2);
  $("#backgroundImage option[value='custom']").text(lang.option_bg_custom);
  $(formGroups[3]).find(".form-hint").text(lang.form_hint_bg);

  // Кнопки футера
  modal.find(".modal-btn-secondary#resetBtn").text(lang.modal_btn_reset);
  modal.find(".modal-btn-secondary#closeSettingsBtn2").text(lang.modal_btn_cancel);
  modal.find(".modal-btn-primary#saveBtn").text(lang.modal_btn_save);
}



