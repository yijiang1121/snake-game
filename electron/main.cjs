const { app, BrowserWindow } = require('electron');
const path = require('node:path');

let mainWindow = null;

function createWindow() {
  if (mainWindow) {
    return;
  }

  mainWindow = new BrowserWindow({
    width: 900,
    height: 900,
    minWidth: 640,
    minHeight: 720,
    backgroundColor: '#0b0b0f',
    show: false,
    title: 'Classic Snake',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  const indexPath = path.join(__dirname, '..', 'index.html');
  mainWindow.loadFile(indexPath);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
