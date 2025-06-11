import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

// Визначаємо тип повідомлення (можна уточнити, якщо потрібно)
type Message = any;
type WebData = any;

// Тип для callback функцій
type Callback<T> = (data: T) => void;

// Експортуємо API через контекст
contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (msg: Message): void => {
    ipcRenderer.send('message', msg);
  },

  onMessage: (callback: Callback<Message>): void => {
    ipcRenderer.on('reply', (_event: IpcRendererEvent, msg: Message) => {
      callback(msg);
    });
  },

  onSendWeb: (callback: Callback<WebData>): void => {
    ipcRenderer.on('web', (_event: IpcRendererEvent, data: WebData) => {
      callback(data);
    });
  }
});
