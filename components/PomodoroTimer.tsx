'use client';

import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { usePomodoro } from '@/hooks/usePomodoro';

export default function PomodoroTimer() {
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
  } = usePomodoro();

  const progress = getProgress();
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 max-w-md w-full">
        <h1 className="text-4xl font-bold text-white text-center mb-8 flex items-center justify-center gap-2">
          <span className="text-5xl">🍅</span>
          <span>ポモドーロタイマー</span>
        </h1>

        <div className="text-center mb-8">
          <div className={`text-2xl font-semibold ${isWorkSession ? 'text-red-300' : 'text-cyan-300'}`}>
            {isWorkSession ? '作業時間' : '休憩時間'}
          </div>
        </div>

        <div className="relative w-72 h-72 mx-auto mb-8">
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

        <div className="flex gap-3 justify-center mb-8">
          <button
            onClick={isRunning ? pause : start}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-md flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Pause size={20} />
                一時停止
              </>
            ) : (
              <>
                <Play size={20} />
                開始
              </>
            )}
          </button>
          
          <button
            onClick={reset}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-md flex items-center gap-2"
          >
            <RotateCcw size={20} />
            リセット
          </button>
          
          <button
            onClick={skip}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-md flex items-center gap-2"
          >
            <SkipForward size={20} />
            スキップ
          </button>
        </div>

        <div className="text-center text-white text-lg">
          <div>完了したポモドーロ: <span className="font-bold text-2xl">{completedSessions}</span></div>
        </div>
      </div>
    </div>
  );
}