'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { usePomodoro } from '@/hooks/usePomodoro';
import TitleBar from './TitleBar';

export default function PomodoroTimer() {
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const {
    currentTime,
    isRunning,
    isWorkSession,
    completedSessions,
    start,
    pause,
    reset,
    skip,
    formatTime,
    getProgress,
    setVolume: setPomodoroVolume,
  } = usePomodoro();

  useEffect(() => {
    setPomodoroVolume(isMuted ? 0 : volume);
  }, [volume, isMuted, setPomodoroVolume]);

  const progress = getProgress();
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      setVolume(0.5);
    } else {
      setVolume(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-green-600 to-black flex items-center justify-center p-2 md:p-4 pt-12 md:pt-16 app-drag">
      {/* <TitleBar
        isRunning={isRunning}
        isWorkSession={isWorkSession}
        currentTime={currentTime}
        formatTime={formatTime}
      /> */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-3 md:p-12 shadow-2xl border border-white/20 max-w-[280px] md:max-w-md w-full no-drag">
        <h1 className="text-xl md:text-4xl font-bold text-white text-center mb-2 md:mb-8 flex items-center justify-center gap-1 md:gap-2">
          <span className="text-2xl md:text-5xl">🍅</span>
          <span className="text-lg md:text-4xl">Pomodoro</span>
        </h1>

        <div className="text-center mb-2 md:mb-8">
          <div className={`text-base md:text-2xl font-semibold ${isWorkSession ? 'text-red-300' : 'text-cyan-300'}`}>
            {isWorkSession ? 'Work' : 'Break'}
          </div>
        </div>

        <div className="hidden md:block relative w-72 h-72 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="144"
              cy="144"
              r="140"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="144"
              cy="144"
              r="140"
              stroke="white"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold text-white tabular-nums drop-shadow-lg">
              {formatTime(currentTime)}
            </span>
          </div>
        </div>

        <div className="md:hidden space-y-2">
          <div className="text-center">
            <span className="text-3xl font-bold text-white tabular-nums drop-shadow-lg">
              {formatTime(currentTime)}
            </span>
          </div>
          
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2 md:gap-3 justify-center mb-2 md:mb-8 pt-2 md:pt-4">
          <button
            onClick={isRunning ? pause : start}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-1.5 md:py-3 px-3 md:px-6 rounded-lg md:rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-md flex items-center gap-1 md:gap-2"
          >
            {isRunning ? (
              <>
                <Pause size={16} className="md:w-5 md:h-5" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play size={16} className="md:w-5 md:h-5" />
                <span className="hidden sm:inline">Start</span>
              </>
            )}
          </button>
          
          <button
            onClick={reset}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-1.5 md:py-3 px-3 md:px-6 rounded-lg md:rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-md flex items-center gap-1 md:gap-2"
          >
            <RotateCcw size={16} className="md:w-5 md:h-5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          
          <button
            onClick={skip}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-1.5 md:py-3 px-3 md:px-6 rounded-lg md:rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-md flex items-center gap-1 md:gap-2"
          >
            <SkipForward size={16} className="md:w-5 md:h-5"/>
            <span className="hidden sm:inline">Skip</span>
          </button>
        </div>

        <div className="text-center text-white text-sm md:text-lg">
          <div>Completed: <span className="font-bold text-lg md:text-2xl">{completedSessions}</span></div>
        </div>

        {/* 音量コントロール */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={toggleMute}
            className="text-white hover:text-white/80 transition-colors"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 md:w-32 accent-white"
          />
        </div>
      </div>
    </div>
  );
}