import React, { useState, useEffect, useRef } from "react";
import "./Timer.css";

const Timer = () => {
  const WORK_TIME = 25 * 60;
  const SHORT_BREAK = 5 * 60;
  const LONG_BREAK = 15 * 60;

  const [secondsLeft, setSecondsLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeMode, setActiveMode] = useState("work");
  const intervalRef = useRef(null);
  const alarmRef = useRef(null);

  const totalTime =
    activeMode === "work"
      ? WORK_TIME
      : activeMode === "short"
      ? SHORT_BREAK
      : LONG_BREAK;

  const percentage = ((totalTime - secondsLeft) / totalTime) * 100;

  useEffect(() => {
    if (isRunning && !isPaused) {
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
  }, [isRunning, isPaused]);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  const pauseTimer = () => {
    setIsPaused(true);
    clearInterval(intervalRef.current);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
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
    <div
      className={`timer-container ${isRunning || isPaused ? "active-layout" : ""} ${
        (isRunning || isPaused) && activeMode === "work" ? "work-active" : ""
      }`}
    >
      {!isRunning && !isPaused && <h1>🍅 Pomodoro Timer 🍅</h1>}

      {!isRunning && !isPaused && (
        <div className="mode-buttons">
          <button onClick={() => switchMode("work")} className={activeMode === "work" ? "active" : ""}>Work</button>
          <button onClick={() => switchMode("short")} className={activeMode === "short" ? "active" : ""}>Short Break</button>
          <button onClick={() => switchMode("long")} className={activeMode === "long" ? "active" : ""}>Long Break</button>
        </div>
      )}

      <div className="progress-ring">
        <svg className="ring-svg" width="280" height="280">
          <circle className="ring-bg" r="120" cx="140" cy="140" />
          <circle
          className="ring-progress"
          r="120"
          cx="140"
          cy="140"
          style={{
            stroke: activeMode === "work" ? "#ffb74d" : "#f87171",
            strokeDasharray: `${2 * Math.PI * 120}`,
            strokeDashoffset: `${2 * Math.PI * 120 * (1 - percentage / 100)}`
          }}
        />
        </svg>
        <h2 className="timer-display">{formatTime(secondsLeft)}</h2>
      </div>

      <div className="control-buttons">
        {!isRunning && !isPaused && (
          <button onClick={startTimer}>Start</button>
        )}

        {isRunning && !isPaused && (
          <>
            <button onClick={pauseTimer}>Pause</button>
            <button onClick={stopTimer}>Stop</button>
          </>
        )}

        {isPaused && (
          <>
            <button onClick={resumeTimer}>Resume</button>
            <button onClick={stopTimer}>Stop</button>
          </>
        )}
      </div>

      <audio ref={alarmRef} src="/alarm.mp3" />
      <div className="version-label">v1.4</div>
    </div>
  );
};

export default Timer;
