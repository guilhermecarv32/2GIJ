const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const wifi = require('node-wifi');

wifi.init({ iface: null });

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false, // Mudança aqui
      nodeIntegration: true,   // Mudança aqui
      sandbox: false
    }
  });
  win.loadFile('index.html');
}

// Ponte para o Scan de Wi-Fi real
ipcMain.handle('wifi-scan', async () => {
  try {
    const networks = await wifi.scan();
    // Retorna a primeira rede (geralmente a conectada) ou a mais forte
    if (networks.length > 0) {
      return {
        ssid: networks[0].ssid,
        rssi: networks[0].signal_level,
        band: networks[0].frequency > 3000 ? '5GHz' : '2.4GHz'
      };
    }
    return { ssid: 'Nenhuma rede', rssi: -100 };
  } catch (e) {
    return { ssid: 'Erro no Hardware', rssi: -100 };
  }
});

app.whenReady().then(createWindow);