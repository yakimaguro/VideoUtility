const {
  app,
  dialog,
  ipcMain,
  BrowserWindow
} = require('electron');
const path = require('path');
const fs = require('fs')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 720,
    height: 480,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  // Hide Menu
  // mainWindow.setMenu(null);
  mainWindow.loadFile('src/convert.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});