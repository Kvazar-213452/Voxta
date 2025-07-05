import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

type MessageData = any;

type Callback<T> = (data: T) => void;

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (msg: MessageData): void => {
    ipcRenderer.send('message', msg);
  },

  onMessage: (callback: Callback<MessageData>): void => {
    ipcRenderer.on('reply', (_event: IpcRendererEvent, msg: MessageData) => {
      callback(msg);
    });
  }
});
