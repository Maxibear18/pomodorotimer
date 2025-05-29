import React, { useState, useEffect, useRef } from "react";
import "./Timer.css";

const Timer = () => {
  const WORK_TIME = 0.5 * 60;
  const SHORT_BREAK = 0.5 * 60;
  const LONG_BREAK = 0.5 * 60;

  const [secondsLeft, setSecondsLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
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
            setIsFinished(true);
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
      setIsFinished(false);
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
    setIsFinished(false);
    clearInterval(intervalRef.current);
    resetSeconds();
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsFinished(false);
    clearInterval(intervalRef.current);
    resetSeconds();
  };

  const resetSeconds = () => {
    if (activeMode === "work") setSecondsLeft(WORK_TIME);
    else if (activeMode === "short") setSecondsLeft(SHORT_BREAK);
    else if (activeMode === "long") setSecondsLeft(LONG_BREAK);
  };

  const switchMode = (mode) => {
    if (isRunning) return;
    setActiveMode(mode);
    setIsFinished(false);
    if (mode === "work") setSecondsLeft(WORK_TIME);
    else if (mode === "short") setSecondsLeft(SHORT_BREAK);
    else if (mode === "long") setSecondsLeft(LONG_BREAK);
  };

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const getProgressColor = () => {
    if (isFinished) return "#f87171";
    if (activeMode === "work") return "#ffa726";
    if (activeMode === "short") return "#1e88e5";
    if (activeMode === "long") return "#43a047";
  };

  return (
    <div
      className={`timer-container 
        ${(isRunning || isPaused || isFinished) ? "active-layout" : ""} 
        ${isFinished ? "finished" : ""}
        ${!isFinished && activeMode === "work" && (isRunning || isPaused) ? "work-active" : ""}
        ${!isFinished && activeMode === "short" && (isRunning || isPaused) ? "short-active" : ""}
        ${!isFinished && activeMode === "long" && (isRunning || isPaused) ? "long-active" : ""}
      `}
    >
      {!isRunning && !isPaused && !isFinished && <h1>🍅 Pomodoro Timer 🍅</h1>}

      {!isRunning && !isPaused && !isFinished && (
        <div className="mode-buttons">
          <button
            onClick={() => switchMode("work")}
            className={`work ${activeMode === "work" ? "active work" : ""}`}
          >
            Work
          </button>
          <button
            onClick={() => switchMode("short")}
            className={`short ${activeMode === "short" ? "active short" : ""}`}
          >
            Short Break
          </button>
          <button
            onClick={() => switchMode("long")}
            className={`long ${activeMode === "long" ? "active long" : ""}`}
          >
            Long Break
          </button>
        </div>
      )}

      <div className="progress-ring">
        <svg className="ring-svg" width="280" height="280">
          <circle className="ring-bg" r="120" cx="140" cy="140" />
          <circle
            className={`ring-progress ${isFinished ? "finished" : ""}`}
            r="120"
            cx="140"
            cy="140"
            style={{
              stroke: getProgressColor(),
              strokeDasharray: `${2 * Math.PI * 120}`,
              strokeDashoffset: `${2 * Math.PI * 120 * (1 - percentage / 100)}`
            }}
          />
        </svg>
        <h2 className="timer-display">{formatTime(secondsLeft)}</h2>
      </div>

      <div className="control-buttons">
        {!isRunning && !isPaused && !isFinished && (
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
        {isFinished && (
          <button onClick={resetTimer}>Reset</button>
        )}
      </div>

      <audio ref={alarmRef} src="/alarm.mp3" />
      <div className="version-label">v1.2</div>
    </div>
  );
};

export default Timer;
