export interface PomodoroState {
    workTime: number;
    breakTime: number;
    currentTime: number;
    isRunning: boolean;
    isWorkSession: boolean;
    completedSessions: number;
    totalTime: number;
  }
  
  export type SessionType = 'work' | 'break';