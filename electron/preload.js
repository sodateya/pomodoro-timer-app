const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  showNotification: (title, body) => ipcRenderer.invoke('show-notification', { title, body }),
  getAudioPath: (type) => ipcRenderer.invoke('get-audio-path', type),
  updateTray: (data) => ipcRenderer.send('update-tray', data)
});
