import React, { useState, useEffect, useRef } from "react";
import "./Timer.css";

const Timer = () => {
  const WORK_TIME = 25 * 60;
  const SHORT_BREAK = 5 * 60;
  const LONG_BREAK = 15 * 60;

  const [secondsLeft, setSecondsLeft] = useState(WORK_TIME);
  const [customTotalTime, setCustomTotalTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [activeMode, setActiveMode] = useState("work");
  const [customMinutes, setCustomMinutes] = useState("");
  const [customSeconds, setCustomSeconds] = useState("");
  const [customTimeSet, setCustomTimeSet] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [endTime, setEndTime] = useState(null); // ✅ new state for real-time tracking

  const intervalRef = useRef(null);
  const alarmRef = useRef(null);

  const totalTime =
    activeMode === "work"
      ? WORK_TIME
      : activeMode === "short"
      ? SHORT_BREAK
      : activeMode === "long"
      ? LONG_BREAK
      : customTotalTime || secondsLeft;

  const percentage =
    totalTime > 0 ? ((totalTime - secondsLeft) / totalTime) * 100 : 0;

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const newSecondsLeft = Math.max(
          Math.ceil((endTime - now) / 1000),
          0
        );

        setSecondsLeft(newSecondsLeft);

        if (newSecondsLeft <= 0) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          setIsFinished(true);
          if (alarmRef.current && !isMuted) {
            alarmRef.current.currentTime = 0;
            alarmRef.current.play();
            setTimeout(() => {
              alarmRef.current.pause();
              alarmRef.current.currentTime = 0;
            }, 3000);
          }
        }
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused, endTime, isMuted]);

  useEffect(() => {
    let bubbleInterval;

    if (isRunning && !isPaused) {
      bubbleInterval = setInterval(() => {
        const bubble = document.createElement("div");
        bubble.className = "bubble";

        const size = Math.random() * 15 + 5;
        const duration = Math.random() * 5 + 7;

        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.setProperty("--size", `${size}px`);
        bubble.style.setProperty("--duration", `${duration}s`);

        document.body.appendChild(bubble);

        setTimeout(() => {
          bubble.remove();
        }, duration * 1000);
      }, 400);
    }

    return () => clearInterval(bubbleInterval);
  }, [isRunning, isPaused]);

  const startTimer = () => {
    let totalSecs;

    if (activeMode === "custom" && !customTimeSet) {
      const mins = parseInt(customMinutes) || 0;
      const secs = parseInt(customSeconds) || 0;
      totalSecs = mins * 60 + secs;
      if (totalSecs <= 0) return;
      setSecondsLeft(totalSecs);
      setCustomTotalTime(totalSecs);
      setCustomTimeSet(true);
    } else {
      totalSecs = secondsLeft;
    }

    const now = Date.now();
    setEndTime(now + totalSecs * 1000);
    setIsRunning(true);
    setIsPaused(false);
    setIsFinished(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
    clearInterval(intervalRef.current);
  };

  const resumeTimer = () => {
    const now = Date.now();
    setEndTime(now + secondsLeft * 1000);
    setIsPaused(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsFinished(false);
    clearInterval(intervalRef.current);
    resetSeconds(true);
    setEndTime(null);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsFinished(false);
    setCustomTimeSet(false);
    setCustomMinutes("");
    setCustomSeconds("");
    setCustomTotalTime(0);
    clearInterval(intervalRef.current);
    resetSeconds(true);
    setEndTime(null);
  };

  const resetSeconds = (isStop = false) => {
    if (activeMode === "work") setSecondsLeft(WORK_TIME);
    else if (activeMode === "short") setSecondsLeft(SHORT_BREAK);
    else if (activeMode === "long") setSecondsLeft(LONG_BREAK);
    else if (activeMode === "custom") {
      if (isStop) setSecondsLeft(customTotalTime);
      else {
        setCustomMinutes("");
        setCustomSeconds("");
        setCustomTotalTime(0);
        setCustomTimeSet(false);
        setSecondsLeft(0);
      }
    }
  };

  const switchMode = (mode) => {
    if (isRunning) return;
    setActiveMode(mode);
    setIsFinished(false);
    setCustomTimeSet(false);
    setCustomTotalTime(0);
    setEndTime(null);

    if (mode === "work") setSecondsLeft(WORK_TIME);
    else if (mode === "short") setSecondsLeft(SHORT_BREAK);
    else if (mode === "long") setSecondsLeft(LONG_BREAK);
    else if (mode === "custom") setSecondsLeft(0);
  };

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const getProgressColor = () => {
    if (isFinished) return "#f87171";
    if (activeMode === "work") return "#ffa726";
    if (activeMode === "short") return "#1e88e5";
    if (activeMode === "long") return "#43a047";
    if (activeMode === "custom") return "#9575cd";
  };

  return (
    <div
      className={`timer-container 
        ${(isRunning || isPaused || isFinished) ? "active-layout" : ""} 
        ${isFinished ? "finished" : ""}
        ${!isFinished && activeMode === "work" && (isRunning || isPaused) ? "work-active" : ""}
        ${!isFinished && activeMode === "short" && (isRunning || isPaused) ? "short-active" : ""}
        ${!isFinished && activeMode === "long" && (isRunning || isPaused) ? "long-active" : ""}
        ${!isFinished && activeMode === "custom" && (isRunning || isPaused) ? "custom-active" : ""}
      `}
    >
      {!isRunning && !isPaused && !isFinished && <h1>🍅 Pomodoro Timer 🍅</h1>}

      {!isRunning && !isPaused && !isFinished && (
        <div className="mode-buttons">
          <button onClick={() => switchMode("work")} className={`work ${activeMode === "work" ? "active work" : ""}`}>Work</button>
          <button onClick={() => switchMode("short")} className={`short ${activeMode === "short" ? "active short" : ""}`}>Short Break</button>
          <button onClick={() => switchMode("long")} className={`long ${activeMode === "long" ? "active long" : ""}`}>Long Break</button>
          <button onClick={() => switchMode("custom")} className={`custom ${activeMode === "custom" ? "active custom" : ""}`}>Custom</button>
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

        {activeMode === "custom" && !customTimeSet ? (
          <div className="custom-inputs">
            <input
              type="number"
              min="0"
              placeholder="Minutes"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
            />
            <input
              type="number"
              min="0"
              max="59"
              placeholder="Seconds"
              value={customSeconds}
              onChange={(e) => setCustomSeconds(e.target.value)}
            />
          </div>
        ) : (
          <div className="timer-display">{formatTime(secondsLeft)}</div>
        )}
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

      <button
        className="mute-button"
        onClick={() => setIsMuted((prev) => !prev)}
      >
        {isMuted ? "🔇 Muted" : "🔊 Sound On"}
      </button>

      <audio ref={alarmRef} src="/alarm.mp3" />
      <div className="version-label">v1.4</div>
    </div>
  );
};

export default Timer;
