let chats = {};
let user = {};

let chat_id_select = null;
let chat_select = null;
let user_id = null;
let currentChatId = 1;
let index = 1;

let settings = {};

const defaultSettings = {
  darkMode: true,
  browserNotifications: true,
  doNotDisturb: false,
  language: 'uk',
  readReceipts: true,
  onlineStatus: true,
};

let thisShowUserNamePopup;
