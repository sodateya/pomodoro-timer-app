'use client';

import React from 'react';
import { Play, Pause } from 'lucide-react';

interface TitleBarProps {
  isRunning: boolean;
  isWorkSession: boolean;
  currentTime: number;
  formatTime: (seconds: number) => string;
}

export default function TitleBar({ isRunning, isWorkSession, currentTime, formatTime }: TitleBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-10 bg-black/80 backdrop-blur-md flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
        <span className="text-white text-sm">
          {isWorkSession ? '作業中' : '休憩中'} - {formatTime(currentTime)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {isRunning ? <Pause size={14} className="text-white" /> : <Play size={14} className="text-white" />}
      </div>
    </div>
  );
} 