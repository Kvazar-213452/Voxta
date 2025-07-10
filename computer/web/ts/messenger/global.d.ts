declare global {
  interface Window {
    electronAPI: {
      sendMessage: (data: any) => void;
      onMessage: (callback: (data: any) => void) => void;
    };
    user: any;
    settings: any;
    AppData: AppDataType;
  }
}

interface AppDataType {
  chats: Record<string, any>;
  user: any;
  chat_id_select: any;
  chat_select: { id: number; type: string };
  user_id: string;
  currentChatId: number;
  index: number;
  settings: Record<string, any>;
  defaultSettings: Record<string, any>;
  thisShowUserNamePopup: any;
  statusUserProfile: string;
  selectIdUserProfile: string;
}


export {};