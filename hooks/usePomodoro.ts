'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PomodoroState } from '@/types/pomodoro';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

export const usePomodoro = () => {
  const [state, setState] = useState<PomodoroState>({
    workTime: WORK_MINUTES * 60,
    breakTime: BREAK_MINUTES * 60,
    currentTime: WORK_MINUTES * 60,
    isRunning: false,
    isWorkSession: true,
    completedSessions: 0,
    totalTime: WORK_MINUTES * 60,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeRef = useRef<number>(0.5);

  const workStartSounds = [
    '/sounds/workStart/start1.mp3',
    '/sounds/workStart/start2.mp3',
    '/sounds/workStart/start3.mp3',
    '/sounds/workStart/start4.mp3',
    '/sounds/workStart/start5.mp3',
  ];

  const workEndSounds = [
    '/sounds/workEnd/end1.mp3',
    '/sounds/workEnd/end2.mp3',
    '/sounds/workEnd/end3.mp3',
    '/sounds/workEnd/end4.mp3',
  ];

  const setVolume = useCallback((volume: number) => {
    volumeRef.current = volume;
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  const playRandomSound = useCallback(async (sounds: string[]) => {
    const randomIndex = Math.floor(Math.random() * sounds.length);
    if (audioRef.current) {
      // Electron環境の場合
      if (window.electronAPI) {
        const type = sounds[randomIndex].includes('workStart') ? 'workStart' : 'workEnd';
        try {
          const audioPath = await window.electronAPI.getAudioPath(type);
          console.log('Playing sound:', { type, audioPath });
          
          audioRef.current.src = audioPath;
          audioRef.current.volume = volumeRef.current;
          await audioRef.current.play();
          console.log('Sound played successfully');
        } catch (error) {
          console.error('Audio playback failed:', error);
          console.error('Error details:', error);
        }
      } else {
        // 通常のWeb環境の場合
        audioRef.current.src = sounds[randomIndex];
        audioRef.current.volume = volumeRef.current;
        audioRef.current.play().catch(error => {
          console.error('Audio playback failed:', error);
        });
      }
    }
  }, []);

  const playBreakCompleteSound = useCallback(async () => {
    if (audioRef.current) {
      // Electron環境の場合
      if (window.electronAPI) {
        try {
          const audioPath = await window.electronAPI.getAudioPath('breakComplete');
          audioRef.current.src = audioPath;
          audioRef.current.volume = volumeRef.current;
          await audioRef.current.play();
        } catch (error) {
          console.error('Audio playback failed:', error);
          console.error('Error details:', error);
        }
      } else {
        // 通常のWeb環境の場合
        audioRef.current.src = '/sounds/break-complete.mp3';
        audioRef.current.volume = volumeRef.current;
        audioRef.current.play().catch(error => {
          console.error('Audio playback failed:', error);
        });
      }
    }
  }, []);

  const start = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }));
    if (state.isWorkSession && state.currentTime === state.workTime) {
      playRandomSound(workStartSounds);
    }
  }, [state.isWorkSession, state.currentTime, state.workTime, playRandomSound, workStartSounds]);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: false,
      currentTime: prev.isWorkSession ? prev.workTime : prev.breakTime,
      totalTime: prev.isWorkSession ? prev.workTime : prev.breakTime,
    }));
  }, []);

  const switchSession = useCallback(() => {
    setState(prev => {
      const newIsWorkSession = !prev.isWorkSession;
      const newTime = newIsWorkSession ? prev.workTime : prev.breakTime;
      
      return {
        ...prev,
        isWorkSession: newIsWorkSession,
        currentTime: newTime,
        totalTime: newTime,
        completedSessions: prev.isWorkSession ? prev.completedSessions + 1 : prev.completedSessions,
      };
    });
  }, []);

  const skip = useCallback(() => {
    pause();
    switchSession();
  }, [pause, switchSession]);

  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (state.isRunning && state.currentTime > 0) {
      intervalRef.current = setInterval(() => {
        setState(prev => ({ ...prev, currentTime: prev.currentTime - 1 }));
        // トレイの更新
        if (window.electronAPI) {
          window.electronAPI.updateTray({
            isRunning: state.isRunning,
            isWorkSession: state.isWorkSession,
            currentTime: state.currentTime - 1
          });
        }
      }, 1000);
    } else if (state.currentTime === 0) {
      // セッション完了
      if (state.isWorkSession) {
        playRandomSound(workEndSounds);
      } else {
        playRandomSound(workStartSounds);
      }
      
      switchSession();
      
      // 自動で次のセッションを開始
      setTimeout(() => {
        start();
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.currentTime, state.isWorkSession, playRandomSound, switchSession, start, workEndSounds, workStartSounds]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    return ((state.totalTime - state.currentTime) / state.totalTime) * 100;
  };

  return {
    ...state,
    start,
    pause,
    reset,
    skip,
    formatTime,
    getProgress,
    setVolume,
  };
};
