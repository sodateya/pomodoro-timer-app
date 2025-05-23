interface ElectronAPI {
  showNotification: (title: string, body: string) => Promise<void>;
  getAudioPath: (type: 'workStart' | 'workEnd' | 'breakComplete') => string;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {}; 