const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInWorld('electronAPI', {
  wifiScan: () => ipcRenderer.invoke('wifi-scan')
});

//teste