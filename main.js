const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const wifi = require('node-wifi');

wifi.init({ iface: null });

// Lê o sinal da rede conectada diretamente do driver via netsh.
// Suporta Windows em PT-BR e EN.
function readCurrentSignal() {
  return new Promise((resolve) => {
    exec('netsh wlan show interfaces', { encoding: 'buffer' }, (err, buf) => {
      if (err) { console.error('netsh error:', err); resolve(null); return; }

      const stdout = buf.toString('latin1');
      
      // SSID: aceita qualquer indentação (PT e EN têm mesma label)
      const ssidMatch   = stdout.match(/^\s+SSID\s*:\s*(?!.*BSSID)(.+)$/m);
      // Sinal/Signal: suporte PT ("Sinal") e EN ("Signal")
      const signalMatch = stdout.match(/(?:Signal|Sinal)\s*:\s*(\d+)%/i);
      // Tipo de rádio: PT ("Tipo de rádio") e EN ("Radio type")
      const radioMatch  = stdout.match(/(?:Radio type|Tipo de r.dio)\s*:\s*(.+)/i);

      if (!ssidMatch || !signalMatch) {
        console.warn('Regex não encontrou SSID ou Sinal. Verifique o log acima.');
        resolve(null);
        return;
      }

      const ssid   = ssidMatch[1].trim();
      const sigPct = parseInt(signalMatch[1], 10);
      const rssi   = Math.round((sigPct / 2) - 100);
      const radio  = radioMatch ? radioMatch[1].toLowerCase() : '';
      const band   = (radio.includes('5') || radio.includes('ac') || radio.includes('ax'))
                     ? '5GHz' : '2.4GHz';

      resolve({ ssid, rssi, band });
    });
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      nodeIntegration: true,
      sandbox: false
    }
  });
  win.loadFile('index.html');
}

// Ponte para o Scan de Wi-Fi real
// Tira 3 amostras com 400ms de intervalo e retorna a média do RSSI.
// Técnica padrão de site survey para leituras mais estáveis e precisas.
ipcMain.handle('wifi-scan', async () => {
  try {
    const samples = [];
    for (let i = 0; i < 3; i++) {
      if (i > 0) await new Promise(r => setTimeout(r, 400));
      const reading = await readCurrentSignal();
      if (reading) samples.push(reading);
    }

    if (samples.length > 0) {
      const avgRssi = Math.round(
        samples.reduce((acc, s) => acc + s.rssi, 0) / samples.length
      );
      return { ssid: samples[0].ssid, rssi: avgRssi, band: samples[0].band };
    }
    return { ssid: 'Sem conexão Wi-Fi', rssi: -100 };
  } catch (e) {
    return { ssid: 'Erro no Hardware', rssi: -100 };
  }
});

app.whenReady().then(createWindow);
