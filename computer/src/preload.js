const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (msg) => ipcRenderer.send('message', msg),
  onMessage: (callback) => ipcRenderer.on('reply', (event, msg) => callback(msg))
});
