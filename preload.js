const { ipcRenderer } = require('electron');

// Injeção direta (Modo de compatibilidade)
window.electronAPI = {
    wifiScan: () => ipcRenderer.invoke('wifi-scan')
};

console.log("Ponte injetada com sucesso no modo de compatibilidade!");