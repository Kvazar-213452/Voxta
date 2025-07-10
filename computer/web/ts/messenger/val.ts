(window as any).AppData = {
  chats: {},
  user: {},
  chat_id_select: null,
  chat_select: null,
  user_id: null,
  currentChatId: 1,
  index: 1,
  settings: {},
  defaultSettings: {
    darkMode: true,
    browserNotifications: true,
    doNotDisturb: false,
    language: 'uk',
    readReceipts: true,
    onlineStatus: true,
  },
  thisShowUserNamePopup: undefined,
  statusUserProfile: undefined,
  selectIdUserProfile: undefined
};

declare var $: any;
