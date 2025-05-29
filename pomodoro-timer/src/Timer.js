import React, { useState, useEffect, useRef } from "react";
import "./Timer.css";

const Timer = () => {
  const WORK_TIME = 25 * 60;
  const SHORT_BREAK = .5 * 60;
  const LONG_BREAK = 15 * 60;

  const [secondsLeft, setSecondsLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [activeMode, setActiveMode] = useState("work");
  const intervalRef = useRef(null);
  const alarmRef = useRef(null);

  const totalTime = activeMode === "work" ? WORK_TIME : activeMode === "short" ? SHORT_BREAK : LONG_BREAK;
  const percentage = ((totalTime - secondsLeft) / totalTime) * 100;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            if (alarmRef.current) alarmRef.current.play();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const startTimer = () => {
    if (!isRunning) setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const stopTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    if (activeMode === "work") setSecondsLeft(WORK_TIME);
    if (activeMode === "short") setSecondsLeft(SHORT_BREAK);
    if (activeMode === "long") setSecondsLeft(LONG_BREAK);
  };

  const switchMode = (mode) => {
    if (isRunning) return;
    setActiveMode(mode);
    if (mode === "work") setSecondsLeft(WORK_TIME);
    else if (mode === "short") setSecondsLeft(SHORT_BREAK);
    else if (mode === "long") setSecondsLeft(LONG_BREAK);
  };

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className={`timer-container ${isRunning ? "running" : ""}`}>
      {!isRunning && <h1>🍅 Pomodoro Timer 🍅</h1>}

      {!isRunning && (
        <div className="mode-buttons">
          <button onClick={() => switchMode("work")} disabled={isRunning} className={activeMode === "work" ? "active" : ""}>Work</button>
          <button onClick={() => switchMode("short")} disabled={isRunning} className={activeMode === "short" ? "active" : ""}>Short Break</button>
          <button onClick={() => switchMode("long")} disabled={isRunning} className={activeMode === "long" ? "active" : ""}>Long Break</button>
        </div>
      )}

      <div className="progress-ring">
        <svg className="ring-svg" width="200" height="200">
          <circle className="ring-bg" r="90" cx="100" cy="100" />
          <circle
            className="ring-progress"
            r="90"
            cx="100"
            cy="100"
            style={{
              strokeDasharray: `${2 * Math.PI * 90}`,
              strokeDashoffset: `${2 * Math.PI * 90 * (1 - percentage / 100)}`
            }}
          />
        </svg>
        <h2 className="timer-display">{formatTime(secondsLeft)}</h2>
      </div>

      <div className="control-buttons">
        {!isRunning ? (
          <button onClick={startTimer}>Start</button>
        ) : (
          <>
            <button onClick={pauseTimer}>Pause</button>
            <button onClick={stopTimer}>Stop</button>
          </>
        )}
      </div>

      <audio ref={alarmRef} src="/alarm.mp3" />
      <div className="version-label">v1.0</div>
    </div>
  );
};

export default Timer;
