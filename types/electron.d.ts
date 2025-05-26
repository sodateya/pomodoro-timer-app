interface ElectronAPI {
  showNotification: (title: string, body: string) => Promise<void>;
  getAudioPath: (type: 'workStart' | 'workEnd' | 'breakComplete') => string;
  updateTray: (data: { isRunning: boolean; isWorkSession: boolean; currentTime: number }) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {}; 