const { app, BrowserWindow, Notification, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#667eea',
    show: false
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../out/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 通知用IPC
ipcMain.handle('show-notification', (event, { title, body }) => {
  new Notification({ title, body }).show();
});

// 音源ファイルのパスを解決する処理
ipcMain.handle('get-audio-path', async (event, type) => {
  const sounds = {
    workStart: [
      'workStart/start1.mp3',
      'workStart/start2.mp3',
      'workStart/start3.mp3',
      'workStart/start4.mp3',
      'workStart/start5.mp3'
    ],
    workEnd: [
      'workEnd/end1.mp3',
      'workEnd/end2.mp3',
      'workEnd/end3.mp3',
      'workEnd/end4.mp3'
    ]
  };

  const soundArray = sounds[type] || ['beep.mp3'];
  const randomIndex = Math.floor(Math.random() * soundArray.length);
  
  let basePath;
  if (isDev) {
    basePath = __dirname;
  } else {
    basePath = path.join(process.resourcesPath);
  }
  
  const audioPath = path.join(basePath, 'sounds', soundArray[randomIndex]);
  
  // ファイルの存在確認
  try {
    if (fs.existsSync(audioPath)) {
      console.log('Audio file exists:', audioPath);
      return `file://${audioPath}`;
    } else {
      console.error('Audio file not found:', audioPath);
      // 代替のパスを試す
      const altPath = path.join(process.resourcesPath, 'sounds', soundArray[randomIndex]);
      if (fs.existsSync(altPath)) {
        console.log('Found audio file at alternative path:', altPath);
        return `file://${altPath}`;
      }
    }
  } catch (error) {
    console.error('Error checking audio file:', error);
  }
  
  return `file://${audioPath}`;
});
