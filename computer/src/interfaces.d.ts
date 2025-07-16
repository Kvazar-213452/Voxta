// ======= db local =======
declare interface MsgToDb {
  sender: string;
  content: string;
  time: string;
}

// ======= chat servise =======
declare interface Message {
  id: string; 
  sender: string; 
  content: string; 
  time: string
}

declare interface MessageNoneId {
  sender: string; 
  content: string; 
  time: string
}

// ======= settings =======
declare type Settings = {
  darkMode: boolean;
  browserNotifications: boolean;
  doNotDisturb: boolean;
  language: string;
  readReceipts: boolean;
  onlineStatus: boolean;
  cripto: string;
};

// ======= global =======
declare interface User {
  id: string;
  name: string;
  password: string;
  time: string;
  avatar: string;
  desc: string;
  chats: string[];
}

interface Chat {
  name: string;
  description: string;
  privacy: string;
  avatar: string | null;
  createdAt: string;
}

declare interface EncryptedData {
  key: string;
  data: string;
}



declare type typeChat = 'offline' | 'online';;
