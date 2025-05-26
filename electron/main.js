const { app, BrowserWindow, Notification, ipcMain, Tray, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let tray = null;

function createTray() {
  tray = new Tray(path.join(__dirname, '../public/tray-icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: '作業中 - 25:00', enabled: false },
    { type: 'separator' },
    { label: '表示', click: () => mainWindow.show() },
    { label: '終了', click: () => app.quit() }
  ]);
  tray.setToolTip('Pomodoro Timer');
  tray.setContextMenu(contextMenu);
}

function updateTrayMenu(isRunning, isWorkSession, currentTime) {
  if (!tray) return;
  
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const status = isWorkSession ? '作業中' : '休憩中';
  const runningStatus = isRunning ? '▶' : '⏸';
  
  const contextMenu = Menu.buildFromTemplate([
    { label: `${status} ${runningStatus} ${timeString}`, enabled: false },
    { type: 'separator' },
    { label: '表示', click: () => mainWindow.show() },
    { label: '終了', click: () => app.quit() }
  ]);
  
  tray.setContextMenu(contextMenu);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#000000',
      symbolColor: '#ffffff',
      height: 40
    },
    backgroundColor: '#667eea',
    transparent: true,
    alwaysOnTop: true,
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

  // ウィンドウを閉じた時にアプリを終了せず、トレイに格納
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();
});

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

// アプリケーションの終了処理
app.on('before-quit', () => {
  app.isQuitting = true;
});

// タイマー状態の更新をトレイに反映
ipcMain.on('update-tray', (event, { isRunning, isWorkSession, currentTime }) => {
  updateTrayMenu(isRunning, isWorkSession, currentTime);
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
      'workEnd/end4.mp3',
      'workEnd/end5.mp3'
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
