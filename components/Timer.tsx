"use client";

import React from "react";

interface TimerProps {
  time: number | null; // Current time in seconds
  timerError: string | null; // Error message if timer fails
}

const Timer: React.FC<TimerProps> = ({ time, timerError }) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  if (time === null && !timerError) return null; // Don’t render if no timer and no error

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Temps restant</h2>
      {time !== null && (
        <p className={`text-lg font-medium ${time > 0 ? "text-red-500" : "text-gray-500"}`}>
          {time > 0 ? formatTime(time) : "Temps écoulé"}
        </p>
      )}
      {timerError && <p className="text-sm text-red-500">{timerError}</p>}
    </div>
  );
};

export default Timer;
