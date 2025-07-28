import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

type Message = any;

type Callback<T> = (data: T) => void;

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (msg: Message): void => {
    ipcRenderer.send('message', msg);
  },

  onMessage: (callback: Callback<Message>): void => {
    ipcRenderer.on('reply', (_event: IpcRendererEvent, msg: Message) => {
      callback(msg);
    });
  }
});
